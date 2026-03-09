<div align="center">
<img src="./public/favicon.svg" width="80"/>

# Auth Dev

**Node.js simple authorization service for development environment**

<a href="https://opensource.org/license/mit"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" height="24" /></a>
<a href="https://pnpm.io/"><img src="https://img.shields.io/badge/Package-PNPM-orange?style=flat-square" height="24" /></a>
<img src="https://img.shields.io/badge/Module-ECMAScript-yellow?style=flat-square" height="24" />
</div>

![Preview](https://github.com/user-attachments/assets/ea04844c-b0e5-41f6-8004-8e58613db824)

## Features
- Create, update, and delete user account
- Validation checking with JSON Web Key Sets
- Simple documentation, serves as learning material

## Stack Used
- Monolithic [Fastify](https://fastify.dev/)
- [Bootstrap CSS](https://getbootstrap.com/)
- [Alpine.js](https://alpinejs.dev/)
- [Google Firebase](https://firebase.google.com/)

## Local Preview
1. Clone this repository to your local computer
2. Copy the default environment file and ensure all variables are correctly filled
   ```sh
   cp .env.example .env
   ```
3. Install all required dependencies
   ```sh
   pnpm i
   ```
4. Run the application in development mode
   ```sh
   pnpm run dev
   ```
