---
title: Модель данных (ERD)
sidebar_position: 1
description: Шаблон ERD-диаграммы системы мониторинга качества
---

# Модель данных (ERD)

:::caution Шаблон
ERD-диаграмма будет добавлена после финального согласования модели данных с командой.  
Ниже описаны сущности, связи и атрибуты на основе анализа требований.
:::

---

## Сущности и атрибуты

### users (Пользователи)
| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | Идентификатор |
| fullName | VARCHAR | Полное имя |
| role | ENUM | ENGINEER / ANALYST / MANAGER |
| login | VARCHAR UNIQUE | Логин |
| password | VARCHAR | Хэш пароля |
| email | VARCHAR | Email |

### chats (Чаты)
| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | Идентификатор |
| name | VARCHAR | Название чата |
| createdAt | TIMESTAMP | Дата создания |
| createdBy | UUID FK → users | Автор |

### messages (Сообщения)
| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | Идентификатор |
| chatId | UUID FK → chats | Принадлежность чату |
| sender | ENUM | USER / AI |
| timestamp | TIMESTAMP | Время отправки |
| content | TEXT | Содержимое |
| status | ENUM | READY / PROCESSING |

### reports (Справки)
| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | Идентификатор |
| templateId | INTEGER FK → templates | Шаблон |
| title | VARCHAR | Заголовок |
| createdAt | TIMESTAMP | Дата создания |
| createdBy | UUID FK → users | Автор |
| status | ENUM | READY / PROCESSING / ERROR |
| bodyUrl | VARCHAR | Ссылка на body в Object Storage |

### templates (Шаблоны справок)
| Поле | Тип | Описание |
|------|-----|----------|
| id | INTEGER PK | Идентификатор |
| name | VARCHAR | Название шаблона |
| description | TEXT | Описание |
| parameters | JSONB | Параметры шаблона (гибкая схема) |
| body | TEXT | Тело шаблона |

### sensor_data (Данные датчиков)
| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | Идентификатор |
| equipmentId | VARCHAR | ID оборудования |
| timestamp | TIMESTAMP | Время снятия показания |
| parameterName | VARCHAR | Название параметра |
| parameterValue | FLOAT | Значение |
| unit | VARCHAR | Единица измерения |

### system_logs (Логи)
| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | Идентификатор |
| timestamp | TIMESTAMP | Время события |
| level | ENUM | INFO / WARN / ERROR |
| source | VARCHAR | Источник события |
| message | TEXT | Текст лога |
| userId | UUID FK → users | Пользователь (опционально) |

---

## Связи между сущностями

```
users ──< chats         (один пользователь — много чатов)
chats ──< messages      (один чат — много сообщений)
users ──< reports       (один пользователь — много справок)
templates ──< reports   (один шаблон — много справок)
users ──< system_logs   (пользователь может фигурировать в логах)
```

---

## Размещение в хранилищах

| Сущность | Хранилище |
|----------|-----------|
| users, chats, messages, reports, templates | PostgreSQL |
| sensor_data | TimescaleDB (Time-Series) |
| system_logs, chats (поиск) | Elasticsearch |
| reports.body (файлы) | Object Storage (S3-совместимый) |
