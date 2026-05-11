---
title: Модель данных (ERD)
sidebar_position: 1
description: ERD-диаграмма системы мониторинга качества
---

# Модель данных (ERD)

## Концептуальная модель

Были выделены следующие сущности:

1. **User** (пользователь) — субъект всех действий в системе
2. **Role** (роль) — справочник в котором содержится информация о ролях и доступах
3. **Chat** (чат с ИИ) — контейнер в котором содержится диалог с ИИ
4. **Chat_Message** (сообщение) — сообщение в чате, формирует историю диалога
5. **Report** (справка/отчёт) — основной документ, который формирует система
6. **Template** (шаблон справки) — инструкция по которой формируется справка
7. **Report_Status** (статус отчёта) — справочник с состояниями справки
8. **Report_Status_History** (история статуса отчёта) — таблица с данными об изменениях статусов справок
9. **Sender_Type** (справочник) — справочник в котором содержится список типов отправителей
10. **User_Role** (связь роли и пользователя) — справочник в котором хранится информация о том какие роли есть у пользователя

```plantuml
@startuml
skinparam linetype ortho
skinparam roundcorner 10
skinparam defaultFontSize 13
skinparam entity {
  BackgroundColor #F8F9FA
  BorderColor #1890ff
  ArrowColor #1890ff
}

entity "User\n(Пользователь)" as User
entity "Role\n(Роль)" as Role
entity "User_Role\n(Связь роли и пользователя)" as UserRole
entity "Chat\n(Чат с ИИ)" as Chat
entity "Chat_Message\n(Сообщение)" as ChatMessage
entity "Sender_Type\n(Тип отправителя)" as SenderType
entity "Template\n(Шаблон справки)" as Template
entity "Report\n(Справка)" as Report
entity "Report_Status\n(Статус справки)" as ReportStatus
entity "Report_Status_History\n(История статусов)" as ReportStatusHistory

User ||--o{ UserRole : "имеет"
Role ||--o{ UserRole : "назначается"
User ||--o{ Chat : "создаёт"
Chat ||--o{ ChatMessage : "содержит"
SenderType ||--o{ ChatMessage : "определяет тип"
User ||--o{ ChatMessage : "отправляет"
User ||--o{ Template : "создаёт"
Template ||--o{ Report : "используется в"
User ||--o{ Report : "создаёт"
ReportStatus ||--o{ Report : "определяет статус"
Report ||--o{ ReportStatusHistory : "имеет историю"
ReportStatus ||--o{ ReportStatusHistory : "old status"
ReportStatus ||--o{ ReportStatusHistory : "new status"
User ||--o{ ReportStatusHistory : "изменяет"
@enduml
```

---

## Логическая модель

Выделены сущности `role` и `report_status`, т.к. в процессе развития системы могут добавляться роли и статусы — использовать enum нецелесообразно. Применён паттерн **L2**.

Применён паттерн **L3** — история изменений для сущности `report_status_history`. Справки меняют статус во время жизненного цикла (`PROCESSING`, `READY`, `ERROR`) и его необходимо отслеживать.

Выделена сущность `User_Role` (паттерн **L1**) для связи ролей и пользователя — у одного пользователя может быть несколько ролей для доступа к разным частям системы.

```plantuml
@startuml
skinparam linetype ortho
skinparam roundcorner 8
skinparam defaultFontSize 12
skinparam entity {
  BackgroundColor #F8F9FA
  BorderColor #1890ff
  ArrowColor #555555
  HeaderBackgroundColor #1890ff
  FontColor #000000
}

entity "user" as user {
  * id : integer <<PK>>
  --
  * first_name : varchar
  * last_name : varchar
    middle_name : varchar
  * created_at : timestamp
  * updated_at : timestamp
}

entity "role" as role {
  * id : integer <<PK>>
  --
  * name : varchar <<unique>>
}

entity "user_role" as user_role {
  * user_id : integer <<PK, FK>>
  * role_id : integer <<PK, FK>>
}

entity "chat" as chat {
  * id : integer <<PK>>
  --
    title : varchar
  * created_at : timestamp
  * updated_at : timestamp
  * created_by : integer <<FK>>
}

entity "sender_type" as sender_type {
  * id : integer <<PK>>
  --
  * name : varchar <<unique>>
}

entity "chat_message" as chat_message {
  * id : integer <<PK>>
  --
  * chat_id : integer <<FK>>
  * sender_type_id : integer <<FK>>
    sender_id : integer <<FK>>
  * created_at : timestamp
  * content : text
}

entity "template" as template {
  * id : integer <<PK>>
  --
  * name : varchar
  * structure : text
  * created_at : timestamp
  * updated_at : timestamp
  * created_by : integer <<FK>>
}

entity "report" as report {
  * id : integer <<PK>>
  --
  * title : varchar
    template_id : integer <<FK>>
  * created_by : integer <<FK>>
  * created_at : timestamp
  * updated_at : timestamp
  * status_id : integer <<FK>>
    body : text
}

entity "report_status" as report_status {
  * id : integer <<PK>>
  --
  * name : varchar <<unique>>
}

entity "report_status_history" as report_status_history {
  * id : integer <<PK>>
  --
  * report_id : integer <<FK>>
    old_status_id : integer <<FK>>
  * new_status_id : integer <<FK>>
  * changed_at : timestamp
  * changed_by : integer <<FK>>
}

user ||--o{ user_role : ""
role ||--o{ user_role : ""
user ||--o{ chat : "создаёт"
chat ||--o{ chat_message : "содержит"
sender_type ||--o{ chat_message : "тип"
user ||--o{ chat_message : "отправляет"
user ||--o{ template : "создаёт"
user ||--o{ report : "создаёт"
template ||--o{ report : "используется"
report_status ||--o{ report : "статус"
report ||--o{ report_status_history : "история"
report_status ||--o{ report_status_history : "old status"
report_status ||--o{ report_status_history : "new status"
user ||--o{ report_status_history : "изменяет"
@enduml
```

---

## Физическая модель

Т.к. часть данных (`chat_message`, `report_status`, `report_status_history`) обновляется чаще остальных, их можно считать горячими данными и вынести в отдельные таблицы (паттерн **Р1**).

Применён паттерн **Р4** — индексация. Актуальные данные запрашиваются чаще исторических, поэтому индексация применена в таблицах `report`, `chat`, `chat_message`.

```plantuml
@startuml
skinparam linetype ortho
skinparam roundcorner 8
skinparam defaultFontSize 11
skinparam entity {
  BackgroundColor #F8F9FA
  BorderColor #1890ff
  ArrowColor #555555
  HeaderBackgroundColor #1890ff
  FontColor #000000
}

entity "user" as user {
  * id : serial <<PK>>
  --
  * first_name : varchar(100)
  * last_name : varchar(100)
    middle_name : varchar(100)
  * created_at : timestamptz [default: now()]
  * updated_at : timestamptz [default: now()]
}

entity "role" as role {
  * id : smallserial <<PK>>
  --
  * name : varchar(100) <<unique>>
}

entity "user_role" as user_role {
  * user_id : int <<PK, FK>>
  * role_id : smallint <<PK, FK>>
  --
  index: (role_id)
}

entity "sender_type" as sender_type {
  * id : smallserial <<PK>>
  --
  * name : varchar(50) <<unique>>
}

entity "chat" as chat {
  * id : serial <<PK>>
  --
    title : varchar(255)
  * created_at : timestamptz [default: now()]
  * updated_at : timestamptz [default: now()]
  * created_by : int <<FK>>
  --
  index: (created_by)
  index: (created_at)
}

entity "chat_message" as chat_message {
  * id : bigserial <<PK>>
  --
  * chat_id : int <<FK>>
  * sender_type_id : smallint <<FK>>
    sender_id : int <<FK>>
  * created_at : timestamptz [default: now()]
  * content : text
  --
  index: (chat_id)
  index: (sender_id)
  index: (created_at)
}

entity "template" as template {
  * id : serial <<PK>>
  --
  * name : varchar(255)
  * structure : text
  * created_at : timestamptz [default: now()]
  * updated_at : timestamptz [default: now()]
  * created_by : int <<FK>>
  --
  index: (created_by)
}

entity "report_status" as report_status {
  * id : smallserial <<PK>>
  --
  * name : varchar(100) <<unique>>
}

entity "report" as report {
  * id : serial <<PK>>
  --
  * title : varchar(255)
    template_id : int <<FK>>
  * created_by : int <<FK>>
  * created_at : timestamptz [default: now()]
  * updated_at : timestamptz [default: now()]
  * status_id : smallint <<FK>>
    body : text
  --
  index: (status_id)
  index: (template_id)
  index: (created_by)
  index: (created_at)
}

entity "report_status_history" as report_status_history {
  * id : bigserial <<PK>>
  --
  * report_id : int <<FK>>
    old_status_id : smallint <<FK>>
  * new_status_id : smallint <<FK>>
  * changed_at : timestamptz [default: now()]
  * changed_by : int <<FK>>
  --
  index: (report_id)
  index: (changed_at)
}

user ||--o{ user_role : ""
role ||--o{ user_role : ""
user ||--o{ chat : "создаёт"
chat ||--o{ chat_message : "содержит"
sender_type ||--o{ chat_message : "тип"
user ||--o{ chat_message : "отправляет"
user ||--o{ template : "создаёт"
user ||--o{ report : "создаёт"
template ||--o{ report : "используется"
report_status ||--o{ report : "статус"
report ||--o{ report_status_history : "история"
report_status ||--o{ report_status_history : "old status"
report_status ||--o{ report_status_history : "new status"
user ||--o{ report_status_history : "изменяет"
@enduml
```

---

## Размещение в хранилищах

| Сущность | Хранилище | Обоснование |
|----------|-----------|-------------|
| user, role, user_role, chat, template, report, report_status | PostgreSQL | ACID, реляционные связи |
| chat_message, report_status_history | PostgreSQL (горячие таблицы, паттерн Р1) | Высокая частота записи и чтения |
| sensor_data | TimescaleDB (Time-Series) | Миллионы записей с временными метками |
| system_logs | Elasticsearch | Полнотекстовый поиск по логам |
| report.body (файлы) | Object Storage (S3) | Хранение крупных документов |
