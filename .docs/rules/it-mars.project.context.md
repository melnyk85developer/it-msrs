# IT-MARS PROJECT CONTEXT (STATIC)

## 1. Project Overview
Backend + Frontend социальной сети уровня production.
Цель: сильный проект для портфолио и трудоустройства.

---

## 2. Backend Technology Stack
- Node.js
- NestJS
- TypeScript
- MongoDB + Mongoose

Архитектура:
- DDD (Domain-Driven Design)
- UseCase-ориентированный подход

---

## 2.1 Frontend Technology Stack
- React
- Redux Toolkit
- TypeScript

Архитектура:
- Микрофронтенд

Принцип:
→ frontend НЕ существует отдельно  
→ frontend работает строго через backend API  
→ архитектурные решения backend напрямую влияют на frontend

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

# 4. Implemented Modules (STABLE)

- Необходимо выбрать моуль md файла для прочтения - только в соответствии с поставленной задачей!!!

## 4.1.1 - auth-frontend-module.md → что уже реализовано и что дальше реализовываем по задаче.
## 4.1.2 - auth-backend-module.md → что уже реализовано и что дальше реализовываем по задаче.
---

## 4.1.3 - user-sessions.frontend-module.md → что уже реализовано и что дальше реализовываем по задаче.
## 4.1.4 - user-sessions.frontend-module.md → что уже реализовано и что дальше реализовываем по задаче.

---
## 4.1.5 - admin.frontend-module.md → что уже реализовано и что дальше реализовываем по задаче.
## 4.1.6 - ai-assistant.frontend-module.md → что уже реализовано и что дальше реализовываем по задаче.
## 4.1.7 - ai-assistant.backend-module.md → что уже реализовано и что дальше реализовываем по задаче.

---

## 4.1.8 - my-profile.frontend-module.md → что уже реализовано и что дальше реализовываем по задаче.
## 4.1.9 - user-profile.frontend-module.md → что уже реализовано и что дальше реализовываем по задаче.
## 4.2.0 - user-accounts.backend-module.md → что уже реализовано и что дальше реализовываем по задаче.

---

## 4.2.1 - posts-for-profile.frontend-module.md → что уже реализовано и что дальше реализовываем по задаче.
## 4.2.2 - posts-for-profile.backend-module.md → что уже реализовано и что дальше реализовываем по задаче.

---

### 4.2.3 - bloggers-platform.frontend-module.md → что уже реализовано и что дальше реализовываем по задаче.
### 4.3.4 - bloggers-platform.backend-module.md → что уже реализовано и что дальше реализовываем по задаче.
### 4.2.5 - posts-bloggers-platform.frontend-module.md → что уже реализовано и что дальше реализовываем по задаче.
### 4.2.6 - posts-bloggers-platform.backend-module.md → что уже реализовано и что дальше реализовываем по задаче.

---

### 4.2.7 - comments.backend-module.md → что уже реализовано и что дальше реализовываем по задаче.

---

### 4.2.8 - user-messages.frontend-module.md → что уже реализовано и что дальше реализовываем по задаче.
### 4.2.9 - user-messages.backend-module.md → что уже реализовано и что дальше реализовываем по задаче.

---

### 4.3.0 - confirmation.backend-module.md → что уже реализовано и что дальше реализовываем по задаче.

---

### 4.3.1 - gallery.backend-module.md → что уже реализовано и что дальше реализовываем по задаче.

---

### 4.3.2 - likes.backend-module.md → что уже реализовано и что дальше реализовываем по задаче.

---

### 4.3.3 - notifications.backend-module.md → что уже реализовано и что дальше реализовываем по задаче.

---

### 4.3.4 - shops-platform.frontend-module.md → что уже реализовано и что дальше реализовываем по задаче.
### 4.3.5 - shops-platform.backend-module.md → что уже реализовано и что дальше реализовываем по задаче.

---

### 4.3.6 - tokens.backend-module.md → что уже реализовано и что дальше реализовываем по задаче.

---

### 4.3.7 - FileService - files.backend-module.md → что уже реализовано и что дальше реализовываем по задаче.

---

### 4.3.8- Bots Generator - admin.backend-module.md → что уже реализовано и что дальше реализовываем по задаче.

---

## 5. Project Evolution
Проект — объединение:
- старый Express проект (блоги) почти весь мигрировал - остались мелочи.
- новая соцсеть на NestJS с блогами, музыкой, видео, магазинами, галереей и интегрированным AI ассистентом в систему.

Текущая цель:
→ единая DDD система уровня production