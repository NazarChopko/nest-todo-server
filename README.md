<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# 📚 NestJS Todo API — Навчальний Проєкт

Це мій навчальний проєкт, створений на базі **NestJS**, в якому я реалізував повноцінну API для туду-додатку. Проєкт охоплює ключові можливості NestJS та інтеграцію з популярними інструментами для бекенду.

---

## 🚀 Основні технології

- **NestJS** — основний фреймворк
- **Prisma ORM** — для взаємодії з базою даних
- **MySQL** — як СУБД
- **AWS S3** — для зберігання файлів
- **Nodemailer** — для надсилання листів
- **Handlebars** — як шаблонізатор для email-повідомлень
- **Passport.js** — для автентифікації з використанням Access та Refresh токенів (JWT)

---

## 🔐 Безпека та доступ

- Реалізована автентифікація на основі `passport-jwt`
- Власні декоратори для обмеження доступу (наприклад, тільки для **адміністратора**)
- Захист приватних маршрутів за допомогою **Guards**

---

## ⚙️ Використані можливості NestJS

- **Middleware**
- **Guards**
- **Interceptors**
- **Custom Decorators**
- **DTOs та Pipes**

---

## 📁 Робота з файлами

- Завантаження та зберігання файлів у **AWS S3**
- Підтримка **завантаження файлів**
- **Потокове скачування відео**
- Підтримка **архівації (zip)** файлів перед скачуванням

---

## 🛠 Інші фічі

- **Seeder** скрипти для Prisma
- Детально структурований код відповідно до модулів
- Розділення доступу за ролями
- Email підтвердження з кастомним шаблоном

---

## Запуск

npm install
npm run start:dev

