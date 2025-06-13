# ${{ values.name }}

Описание сервиса.

## Запуск

```bash
docker build -t ${{ values.name }} .
docker run -p 3000:3000 ${{ values.name }}
```