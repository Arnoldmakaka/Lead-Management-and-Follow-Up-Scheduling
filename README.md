# Laravel and React.js Full-Stack Application

This repository contains the backend and frontend for a full-stack application designed for lead management and follow-up scheduling. The backend is built using Laravel, while the frontend leverages React.js.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
  - [Seeded Test Users](#seeded-test-users)
- [Features](#features)

---

## Project Overview

The system facilitates the following:
1. Management of leads and follow-ups.
2. Role-based access control (RBAC) for secure operations.
3. Integration of notifications and scheduling functionality.

This is a single-page application (SPA) where the backend and frontend work seamlessly together.

---

## Folder Structure

```plaintext
.
├── backend/   # Laravel API for backend functionality
├── frontend/  # React.js SPA for user interaction
```

---

## Getting Started

To get the application running locally, follow these steps:

### Backend Setup

1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   composer install
   ```

3. Set up the environment file:
   ```bash
   cp .env.example .env
   ```

4. Generate an application key:
   ```bash
   php artisan key:generate
   ```

5. Configure your database in the `.env` file and run migrations with seeders:
   ```bash
   php artisan migrate --seed
   ```

6. Start the development server:
   ```bash
   php artisan serve
   ```

### Frontend Setup

1. Navigate to the `frontend/` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

---

## Usage

### Seeded Test Users

The backend comes pre-loaded with test users for different roles. Use these credentials to test various use cases:

| Name       | Email             | Role           | Password  |
|------------|-------------------|----------------|-----------|
| User One   | user@one.com      | Admin          | password  |
| User Two   | user@two.com      | Sales Manager  | password  |
| User Three | user@three.com    | Sales Rep      | password  |

---

## Features

### Backend Features
- **Lead Management**: Create and manage leads with validation.
- **Follow-Up Scheduling**: Schedule follow-ups with status updates.
- **Role-Based Access Control**: Restrict actions based on roles.
- **Notification System**: Notify users about missed follow-ups.
- **Automated Jobs**: Automatically mark overdue follow-ups as missed.

### Frontend Features
- **Role-Specific UI**: Show/hide features based on the user's role.
- **Interactive Components**: Manage leads and schedule follow-ups.
- **Responsive Design**: Optimized for various screen sizes using Bootstrap.
- **API Integration**: Smooth interaction with the Laravel backend using Axios.

---

Enjoy exploring and testing the system! 😊