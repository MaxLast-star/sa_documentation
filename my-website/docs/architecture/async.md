---
title: Асинхронные взаимодействия
sidebar_position: 3
description: Описание асинхронных взаимодействий — генерация справок и стриминг ответа ИИ
---

# Асинхронные взаимодействия

В системе реализовано два асинхронных взаимодействия:

1. **Генерация справок** — пользователь запрашивает справку и может покинуть экран; уведомление придёт по готовности
2. **Ответ от ИИ** — ответ стримится в реальном времени («эффект печати»); при выходе из чата полный ответ будет доступен при следующем открытии

---

## 1. Генерация справок

### Технология: RabbitMQ

| Технология | Плюсы | Минусы |
|------------|-------|--------|
| Apache Kafka | Высокая производительность, масштабируемость | Избыточность для данного сценария, сложность настройки |
| **RabbitMQ** ✅ | Гарантированная доставка, простота внедрения | Меньшая пропускная способность vs Kafka |

**Обоснование выбора RabbitMQ:** обеспечивает очередь задач на генерацию, надёжность доставки и возможность масштабирования в следующих версиях.

### Sequence-диаграмма (PlantUML)

```plantuml
@startuml
skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam sequenceParticipant underline

actor "Пользователь" as User
participant "Frontend" as FE
participant "Backend" as BE
participant "RabbitMQ" as MQ
participant "Worker" as W
database "БД" as DB

User -> FE: Запрос справки по шаблону
FE -> BE: POST /api/v1/reports/{templateID}/generate
BE -> DB: Создать запись\n(status = PROCESSING)
DB --> BE: OK
BE -> MQ: Отправить задачу в очередь
BE --> FE: 202 Accepted (reportId)
FE --> User: "Справка формируется..."

MQ -> W: Получить задачу
W -> DB: Получить шаблон и данные
DB --> W: Данные
W -> W: Сгенерировать справку
W -> DB: Обновить статус (READY)\nСохранить bodyUrl
DB --> W: OK
W -> BE: Уведомление о готовности
BE --> FE: Push-уведомление
FE --> User: "Справка готова"
@enduml
```

### Контракт (AsyncAPI)

Формат данных: **JSON**  
Скачать спецификацию: [asyncapi.yaml](/media-and-data/asyncapi.yaml)

---

## 2. Стриминг ответа от ИИ

### Технология: gRPC

| Технология | Плюсы | Минусы |
|------------|-------|--------|
| WebSocket | Realtime, двунаправленная связь | Нет строгой типизации, сложность поддержки контракта |
| **gRPC** ✅ | Потоковая передача, высокая производительность, низкая задержка | Сложнее реализация, требует protobuf |

**Обоснование выбора gRPC:** потоковая передача ответа, минимальная задержка, строгая типизация и формализованный контракт.

### Sequence-диаграмма (PlantUML)

```plantuml
@startuml
skinparam sequenceArrowThickness 2
skinparam roundcorner 10

actor "Пользователь" as User
participant "Frontend" as FE
participant "Backend" as BE
participant "AI Сервис" as AI
database "БД" as DB

== Пользователь в чате ==

User -> FE: Отправить сообщение
FE -> BE: POST /api/v1/chats/{id}/messages
BE -> DB: Сохранить сообщение\n(status = PROCESSING)
BE -> AI: gRPC StreamChat(message)

loop Стриминг токенов
    AI --> BE: StreamResponse(token)
    BE --> FE: Server-Sent Event (token)
    FE --> User: Отображение токена\n("эффект печати")
end

AI --> BE: StreamResponse(done=true)
BE -> DB: Сохранить полный ответ\n(status = READY)
BE --> FE: Конец стрима
FE --> User: Ответ полностью отображён

== Пользователь покинул чат ==

User -> FE: Закрыть чат
note over BE, AI: Генерация продолжается на сервере
AI --> BE: Продолжение стрима
BE -> DB: Сохранение накопленного ответа
AI --> BE: StreamResponse(done=true)
BE -> DB: Сохранить полный ответ\n(status = READY)

User -> FE: Открыть чат снова
FE -> BE: GET /api/v1/chats/{id}
BE -> DB: Получить сообщения
DB --> BE: Сообщения со статусом READY
BE --> FE: Полный ответ
FE --> User: Показать готовый ответ
@enduml
```

### Контракт (protobuf)

Формат данных: **Protocol Buffers**  
Скачать спецификацию: [gRPC.proto](/media-and-data/gRPC.proto)
