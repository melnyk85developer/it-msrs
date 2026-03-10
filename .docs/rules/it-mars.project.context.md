# IT-MARS PROJECT CONTEXT

## 1. Project Overview
Backend социальной сети уровня production. Цель: сильный проект для портфолио/трудоустройства на базе DDD.

## 2. Technology Stack
- Node.js, NestJS, TypeScript, MongoDB, Mongoose.
- Архитектура: DDD + UseCase-ориентированный подход.

## 3. Realized Modules & Functionality
- **User/Profile:** профили, аватары, галереи, карусели изображений.
- **Posts:** создание постов, галерея, карусели изображений.
- **Blogs:** миграция старой платформы (блоги, посты).
- **Messages:** система сообщений (хранение, удаление у себя/всех через `deletedFor: string[]`).
- **FileService:** хранение файлов в `static/` (аватары, посты) с сохранением оригинальных имен.
- **Bots Generator:** система генерации ботов, постов, фото (интеграция со случайными файлами `static/ftp/avatars`).

## 4. Architectural Constraints
- **UseCase Pattern:** Сервисы как «сервисы-боги» запрещены. Бизнес-логика живет только в UseCase.
- **Repositories:** Доступ к БД строго через репозитории.
- **Error Handling:** Только `DomainException`. Никаких `throw new Error()` в бизнес-слое.
- **State Management (Frontend):** Файлы (Blob) запрещено хранить в Redux (из-за serializable error), только в `useState`.
- **Infrastructure:** Изоляция маппинга Mongoose-документов от доменных сущностей.

## 5. Evolution Context
Проект — результат объединения нескольких систем (блогер-платформа на Express -> социальная сеть на NestJS). Текущая фаза: объединение всех модулей в единую DDD-систему, подготовка к Production-стадии.
