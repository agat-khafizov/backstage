Отлично! 🎉 Переходим к **реалистичному Software Template**, который будет:

---

## ✅ Что будет в шаблоне

| Часть                | Что делает                                |
| -------------------- | ----------------------------------------- |
| 📁 Сервис            | Простой Node.js/Express-сервер            |
| ⚙️ CI/CD             | GitHub Actions: линт + билд + docker push |
| 🐳 Docker            | Dockerfile для контейнеризации            |
| 📄 Helm              | Helm chart для Kubernetes                 |
| 📘 TechDocs          | `docs/index.md` и `mkdocs.yml`            |
| 🗂 catalog-info.yaml | Описание компонента для Backstage         |
| 🧙 template.yaml     | Backstage-шаблон                          |

---

## 📦 1. Структура шаблона

Добавь в GitHub-репозиторий `backstage` следующую папку:

```
templates/node-service-template/
├── template.yaml
└── skeleton/
    ├── README.md
    ├── catalog-info.yaml
    ├── Dockerfile
    ├── helm/
    │   ├── Chart.yaml
    │   └── templates/deployment.yaml
    ├── docs/
    │   └── index.md
    ├── mkdocs.yml
    ├── .github/
    │   └── workflows/ci.yml
    └── src/
        └── index.js
```

---

## 🧙 `template.yaml`

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: node-service-template
  title: Node.js сервис с Helm, CI и Docs
  description: Полноценный шаблон микросервиса
spec:
  owner: user:default/agat
  type: service

  parameters:
    - title: Настройки компонента
      required:
        - name
      properties:
        name:
          type: string
          title: Название компонента
        description:
          type: string
          title: Описание

  steps:
    - id: fetch
      name: Копирование шаблона
      action: fetch:template
      input:
        url: ./skeleton
        values:
          name: ${{ parameters.name }}
          description: ${{ parameters.description }}

    - id: publish
      name: Публикация в GitHub
      action: publish:github
      input:
        repoUrl: github.com?repo=${{ parameters.name }}&owner=agat-khafizov
        title: ${{ parameters.name }}
        description: ${{ parameters.description }}
        visibility: public

    - id: register
      name: Регистрация в Backstage
      action: catalog:register
      input:
        repoContentsUrl: ${{ steps['publish'].output.repoContentsUrl }}
        catalogInfoPath: /catalog-info.yaml
```

---

## 📁 `skeleton` содержимое (основное)

### `README.md`

```md
# ${{ values.name }}

${{ values.description }}
```

### `src/index.js`

```js
const express = require('express');
const app = express();
app.get('/', (_, res) => res.send('Hello from ${{ values.name }}!'));
app.listen(3000, () => console.log('Server running on port 3000'));
```

### `Dockerfile`

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install express
CMD ["node", "src/index.js"]
```

---

## 🛠 GitHub Actions `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install
        run: npm install express
      - name: Docker Build
        run: docker build -t ${{ github.repository }} .
```

---

## 📦 Helm chart

### `helm/Chart.yaml`

```yaml
apiVersion: v2
name: ${{ values.name }}
version: 0.1.0
```

### `helm/templates/deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${{ values.name }}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${{ values.name }}
  template:
    metadata:
      labels:
        app: ${{ values.name }}
    spec:
      containers:
        - name: app
          image: your-docker-registry/${{ values.name }}:latest
          ports:
            - containerPort: 3000
```

---

## 📘 TechDocs

### `mkdocs.yml`

```yaml
site_name: ${{ values.name }}
nav:
  - Home: index.md
```

### `docs/index.md`

````md
# ${{ values.name }}

Описание сервиса.

## Запуск

```bash
docker build -t ${{ values.name }} .
docker run -p 3000:3000 ${{ values.name }}
````

````

---

## 🗂 `catalog-info.yaml`

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: ${{ values.name }}
  description: ${{ values.description }}
  annotations:
    github.com/project-slug: agat-khafizov/${{ values.name }}
    backstage.io/techdocs-ref: dir:.
spec:
  type: service
  lifecycle: experimental
  owner: user:default/agat
````

---

## ⏭ Что делать дальше

1. Добавь этот шаблон в свой репозиторий и зарегистрируй в Backstage
2. Протестируй генерацию сервиса (назови например `real-demo`)
3. Убедись, что:

   * Репозиторий создан
   * Backstage показывает компонент
   * CI работает
   * Документация отрендерилась
   * Helm-чарт можно будет использовать потом для деплоя


