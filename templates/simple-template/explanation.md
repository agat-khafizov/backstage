Отлично! 🚀 Переходим к **одной из самых мощных фич Backstage** — **Software Templates**, с помощью которых ты создашь "волшебную кнопку" для генерации новых сервисов, библиотек, скриптов и чего угодно по шаблону.

---

## 📚 Что такое Software Templates?

Это механизм, с помощью которого пользователи портала могут:

* Выбрать шаблон (например, "Новый микросервис")
* Заполнить форму (название, язык, авторы, и т.д.)
* Получить **готовый репозиторий с кодом** и зарегистрированным компонентом в каталоге Backstage

Ты, как платформа-инженер, **создаёшь такие шаблоны** (на YAML + Skeleton проекта), и пользователи ими пользуются.

---

## 🔨 Что мы сделаем:

| Шаг | Что будем делать                           |
| --- | ------------------------------------------ |
| 1️⃣ | Создадим простой шаблон микросервиса       |
| 2️⃣ | Добавим `template.yaml` и skeleton-код     |
| 3️⃣ | Зарегистрируем шаблон в Backstage          |
| 4️⃣ | Сгенерируем сервис из шаблона              |
| 5️⃣ | Проверим, что компонент появился в Catalog |

---

## 📦 1. Создай шаблон в GitHub-репозитории

Создай новую папку в своём репозитории `backstage`, например:

```
templates/simple-template/
├── template.yaml
├── skeleton/
│   ├── README.md
│   └── catalog-info.yaml
```

---

### 📄 `template.yaml` — описание шаблона

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: simple-template
  title: Шаблон микросервиса
  description: Простой шаблон сервиса с документацией
spec:
  owner: user:default/agat
  type: service

  parameters:
    - title: Информация о компоненте
      required:
        - name
      properties:
        name:
          type: string
          title: Название сервиса
          description: Название компонента и репозитория

  steps:
    - id: fetch
      name: Получение шаблона
      action: fetch:template
      input:
        url: ./skeleton
        values:
          name: ${{ parameters.name }}

    - id: publish
      name: Публикация в GitHub
      action: publish:github
      input:
        repoUrl: github.com?repo=${{ parameters.name }}&owner=agat-khafizov
        title: ${{ parameters.name }}
        description: Сервис, сгенерированный через Backstage
        visibility: public

    - id: register
      name: Регистрация в Catalog
      action: catalog:register
      input:
        repoContentsUrl: ${{ steps['publish'].output.repoContentsUrl }}
        catalogInfoPath: /catalog-info.yaml
```

---

### 📂 `skeleton/README.md`

```md
# ${{ values.name }}

Это шаблон микросервиса, сгенерированный из Backstage.
```

---

### 📂 `skeleton/catalog-info.yaml`

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: ${{ values.name }}
  annotations:
    backstage.io/techdocs-ref: dir:.
spec:
  type: service
  lifecycle: experimental
  owner: user:default/agat
```

---

## 🧷 2. Зарегистрируй шаблон в Backstage

Перейди в **Create → Register existing component → URL to template.yaml**
Введи:

```
https://github.com/agat-khafizov/backstage/blob/main/templates/simple-template/template.yaml
```

После регистрации ты увидишь этот шаблон в Create → **Шаблон микросервиса**

---

## 🧪 3. Протестируй создание нового сервиса

1. Перейди в **Create**
2. Выбери шаблон → **Шаблон микросервиса**
3. Введи название (например, `hello-world`)
4. Подтверди создание
5. Проверь в GitHub — появился новый репозиторий!
6. Проверь в Backstage → Catalog → появился компонент!

---

## 🧠 Что ты освоишь:

* Механизм self-service генерации
* Привязку к GitHub
* Автоматическую регистрацию компонентов
* Основу для построения **developer-порталов** и "всё из коробки"


Ошибки в ходе использования:
1) When using Node.js version 20 or newer, the scaffolder backend plugin requires that it be started with the --no-node-snapshot option. 
        Please make sure that you have NODE_OPTIONS=--no-node-snapshot in your environment.


When using Node.js version 20 or newer, the scaffolder backend plugin requires that it be started with the --no-node-snapshot option. 
        Please make sure that you have NODE_OPTIONS=--no-node-snapshot in your environment.

1 - решение)
echo 'export NODE_OPTIONS=--no-node-snapshot' >> ~/.bashrc
source ~/.bashrc
Либо в подике просто как переменную окружения указывать.