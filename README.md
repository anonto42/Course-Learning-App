# Course Learning App

A backend API service for a course-based learning platform. This project supports two types of users: **Teachers** and **Students**. Teachers can create and manage courses, while students can enroll, give feedback, and take quizzes.

---

## Features

- User Authentication (Register/Login)
-  Teacher account creation
- Create, update, and delete courses
- Like and feedback on courses
- Enroll in courses
- Answer quizzes
- Follow course creators

---

## Folder Structure

```
src/
├── db/
├── utils/ 
├── models/  
├── controllers/       
├── middleware/        
├── routes/            
└── index.ts       
```

---

## Installation

```bash
git clone https://github.com/anonto42/Course-Learning-App.git
cd Course-Learning-App
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory using `.env.sample` as a reference.

### Example `.env.sample`

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## Scripts

| Command        | Description                         |
|----------------|-------------------------------------|
| `npm run dev`  | Run in development mode with Nodemon |
| `npm run build`| Compile TypeScript to JS            |
| `npm start`    | Run compiled JS      |

---

## Teacher API Routes
> Requires Authentication + Teacher Role

| Method | Endpoint         | Description                        |
|--------|------------------|------------------------------------|
| POST   | /create-teacher  | Convert user to teacher            |
| GET    | /course          | Get all courses                    |
| POST   | /course          | Create a new course                |
| PUT    | /course          | Add or update course content       |
| DELETE | /course          | Delete a course                    |

---

## Student API Routes

> Some routes require authentication

| Method | Endpoint    | Description                          |
|--------|-------------|--------------------------------------|
| POST   | /register   | Register new user                    |
| POST   | /login      | Login user                           |
| GET    | /course     | View all available courses           |
| POST   | /like       | Like a course                        |
| POST   | /feedback   | Provide feedback for a course        |
| POST   | /follow     | Follow a course creator              |
| POST   | /answer     | Answer a quiz                        |
| POST   | /enroll     | Enroll in a course                   |

---

## Postman API Collection

You can test all endpoints using the Postman collection:

🔗 [Postman Collection](https://www.postman.com/chunter-7856/workspace/api/collection/33655642-569e8f97-d577-4c43-8883-378b3b46382d?action=share&creator=33655642)

### Postman Environment Variable

| Key | Value |
|-----|-------|
| url | http://localhost:3000/api/v1 |

---

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs (Password hashing)
- dotenv (Environment configuration)

---