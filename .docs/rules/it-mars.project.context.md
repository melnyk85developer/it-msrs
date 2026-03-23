# IT-MARS PROJECT CONTEXT (STATIC)

## 1. Project Overview
Backend социальной сети уровня production.
Цель: сильный проект для портфолио и трудоустройства.

---

## 2. Technology Stack
- Node.js
- NestJS
- TypeScript
- MongoDB + Mongoose

Архитектура:
- DDD (Domain-Driven Design)
- UseCase-ориентированный подход

---

## 3. Architectural Principles

### 3.1 Layers
- Domain
- Application (UseCases)
- Infrastructure
- Interface (Controllers)

---

### 3.2 Core Rules

- Бизнес-логика только в UseCase
- Контроллеры не содержат бизнес-логики
- Доступ к БД только через Repository
- Доменные сущности не зависят от Mongoose
- Маппинг из Mongoose → Domain изолирован

---

### 3.3 Error Handling
Используется только:
- DomainException

Запрещено:
- throw new Error() в бизнес-логике

---

### 3.4 Frontend State Rules
- File / Blob запрещено хранить в Redux
- Использовать useState для файлов

---

## 4. Implemented Modules (STABLE)

### 4.1 User / Profile
- профили пользователей
- аватары
- галереи
- карусель изображений

---

### 4.2 Posts (Profile)
- создание постов
- изображения постов
- галерея
- карусель

---

### 4.3 Blogs (migration)
- блоги
- посты

---

### 4.4 Messages
- отправка сообщений
- хранение
- удаление:
  - у себя
  - у всех
- модель:
  deletedFor: string[]

---

### 4.5 FileService
- хранение файлов в static/
  - avatars/
  - post-images/
- сохранение оригинальных имен файлов
- доступ через:
  ${API_URL}/{path}

---

### 4.6 Bots Generator
- генерация пользователей
- генерация постов
- генерация фото
- случайные файлы из static/ftp/avatars

---

## 5. Project Evolution
Проект — объединение:
- старый Express проект (блоги)
- новая соцсеть на NestJS

Текущая цель:
→ единая DDD система уровня production