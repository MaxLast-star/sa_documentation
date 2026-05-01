---
title: API системы (UI)
sidebar_position: 1
description: REST API для пользовательского интерфейса
---

# API для UI

> Полная OpenAPI-спецификация: [API для UI.yml](https://buildin.ai/preview/305c0de6-4ddd-47bd-9a81-f8fff9e56ad1)

## Роуты (экраны)

| Экран | URL | Описание |
|-------|-----|----------|
| Авторизация | `/login` | Вход в систему → переход на `/home` |
| Главное меню | `/home` | Навигационный центр → `/chat`, `/reports` |
| Чат с ИИ | `/chat` | Взаимодействие с LLM → возврат на `/home` |
| Справки и отчёты | `/reports` | Работа со справками → `/reports/{id}` |
| Детали справки | `/reports/{id}` | Просмотр содержимого справки |

---

## Эндпоинты

### Авторизация

| Действие | Метод | Endpoint | Описание |
|----------|-------|----------|----------|
| Войти | `POST` | `/api/v1/auth/login` | Проверка учётных данных |

### Чат с ИИ

| UI-элемент | Метод | Endpoint | Описание |
|------------|-------|----------|----------|
| Новый чат | `POST` | `/api/v1/chats` | Создаёт чат, возвращает id |
| Поиск по чатам | `GET` | `/api/v1/chats/search?text=` | Поиск по названию/содержимому |
| Список чатов | `GET` | `/api/v1/chats` | Возвращает список чатов |
| Открыть чат | `GET` | `/api/v1/chats/{id}` | Информация по конкретному чату |
| Отправить сообщение | `POST` | `/api/v1/chats/{id}/messages` | Запрос к LLM, сохранение ответа |

### Справки

| UI-элемент | Метод | Endpoint | Описание |
|------------|-------|----------|----------|
| Создать справку | `POST` | `/api/v1/reports` | Создаёт пустую справку |
| История справок | `GET` | `/api/v1/reports` | Список ранее сформированных |
| Сформировать по шаблону | `POST` | `/api/v1/reports/{templateID}/generate` | Генерирует справку по шаблону |
| Открыть справку | `GET` | `/api/v1/reports/{id}` | Полная информация по справке |

---

## Сущности данных

### Пользователь
```json
{
  "id": "string",
  "fullName": "string",
  "role": "enum(ENGINEER, ANALYST, MANAGER)"
}
```

### Сообщение чата
```json
{
  "id": "string",
  "sender": "enum(USER, AI)",
  "timestamp": "datetime",
  "content": "string"
}
```

### Справка
```json
{
  "id": "string",
  "templateID": "integer",
  "title": "string",
  "createdAt": "datetime",
  "createdBy": "string",
  "status": "enum(READY, PROCESSING, ERROR)",
  "body": "string"
}
```
