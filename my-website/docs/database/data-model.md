---
title: Модель данных (ERD)
sidebar_position: 1
description: ERD-диаграмма системы мониторинга качества
---

# Модель данных (ERD)

## Концептуальная модель

![Концептуальная модель](/media-and-data/erd-conceptual.png)

---

## Логическая модель

![Логическая модель](/media-and-data/erd-logical.png)

Выделены сущности `role` и `report_status`, т.к. в процессе развития системы могут добавляться роли и статусы — использовать enum нецелесообразно. Применён паттерн **L2**.

Применён паттерн **L3** — история изменений для сущности `report_status_history`. Справки меняют статус во время жизненного цикла (`PROCESSING`, `READY`, `ERROR`) и его необходимо отслеживать.

Выделена сущность `User_Role` (паттерн **L1**) для связи ролей и пользователя — у одного пользователя может быть несколько ролей.

---

## Физическая модель

![Физическая модель](/media-and-data/erd-physical.png)

Применён паттерн **Р1** — горячие данные (`chat_message`, `report_status`) вынесены в отдельные таблицы.

Применён паттерн **Р4** — индексация в таблицах `report`, `chat`, `chat_message`.

---

## Диаграмма связей (Mermaid ERD)

```mermaid
erDiagram
    users {
        UUID id PK
        VARCHAR fullName
        VARCHAR login
        VARCHAR password
        VARCHAR email
    }
    roles {
        INTEGER id PK
        VARCHAR name
    }
    user_roles {
        UUID userId FK
        INTEGER roleId FK
    }
    chats {
        UUID id PK
        VARCHAR name
        TIMESTAMP createdAt
        UUID createdBy FK
    }
    messages {
        UUID id PK
        UUID chatId FK
        VARCHAR sender
        TIMESTAMP timestamp
        TEXT content
        VARCHAR status
    }
    templates {
        INTEGER id PK
        VARCHAR name
        TEXT description
        JSONB parameters
        TEXT body
    }
    reports {
        UUID id PK
        INTEGER templateId FK
        VARCHAR title
        TIMESTAMP createdAt
        UUID createdBy FK
        VARCHAR bodyUrl
    }
    report_status {
        INTEGER id PK
        VARCHAR name
    }
    report_status_history {
        UUID id PK
        UUID reportId FK
        INTEGER statusId FK
        TIMESTAMP changedAt
    }
    sensor_data {
        UUID id PK
        VARCHAR equipmentId
        TIMESTAMP timestamp
        VARCHAR parameterName
        FLOAT parameterValue
        VARCHAR unit
    }
    system_logs {
        UUID id PK
        TIMESTAMP timestamp
        VARCHAR level
        VARCHAR source
        TEXT message
        UUID userId FK
    }

    users ||--o{ user_roles : "имеет"
    roles ||--o{ user_roles : "назначена"
    users ||--o{ chats : "создаёт"
    chats ||--o{ messages : "содержит"
    users ||--o{ reports : "создаёт"
    templates ||--o{ reports : "используется в"
    reports ||--o{ report_status_history : "имеет историю"
    report_status ||--o{ report_status_history : "фиксируется в"
    users ||--o{ system_logs : "фигурирует в"
```

---

## Размещение в хранилищах

| Сущность | Хранилище |
|----------|-----------|
| users, roles, chats, messages, reports, templates | PostgreSQL |
| sensor_data | TimescaleDB (Time-Series) |
| system_logs, chats (поиск) | Elasticsearch |
| reports.body (файлы) | Object Storage (S3-совместимый) |
