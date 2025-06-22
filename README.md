
**MinuteGram** — a full-stack social media app built as a personal project to learn and showcase modern backend development with Java Spring Boot and a React frontend. This project is designed to be clean, modular, and easy to extend.

---

## Composition

- **Backend:** Java 17, Spring Boot, Spring Data JPA, REST APIs, Maven
- **Frontend:** React.js (with components and services), CSS Modules
- **Database:** SQL
- **API-first:** All data flows through RESTful endpoints
- **No tests yet:** 

---

##  Project Structure

### Backend (`/src/main/java/com/fuckgram/`)

- `controller/` – All the REST API endpoints live here
- `service/` – Business logic and app rules
- `repository/` – Database access using Spring Data JPA
- `entity/` – JPA entities (these map to the DB tables)
- `dto/` – Data Transfer Objects for clean API responses/requests
- `config/` – App configuration (CORS, security, etc.)
- `exception/` – Custom error handling

### Frontend (`/client/src/`)

- `component/` – Reusable React components
- `service/` – Functions for talking to the backend API
- `App.jsx` – Main app layout and routing
- `main.jsx` – Entry point for the React app

---

## Tech Stack

- **Java 17** + **Spring Boot**: For building a robust, modular backend
- **Spring Data JPA**: Simplifies database stuff
- **Maven**: Dependency management and build tool
- **React.js**: For a modern, interactive frontend
- **CSS Modules**: Scoped styles for each component

---

## API Design

- All endpoints follow REST conventions (think `/api/users`, `/api/posts`, etc.)
- Uses proper HTTP verbs: `GET`, `POST`, `PUT`, `DELETE`
- Returns standard HTTP status codes and clear error messages
- DTOs keep API responses clean and decoupled from the DB models

---

## Security

- Passwords are hashed before storing 
- CORS is configured so only allowed frontends can talk to the backend
- JWT enabled. OAuth2 for authentication later.

---

### Access the deployed Project here 

https://regal-selkie-67277e.netlify.app

## Contributing

If you want to play around or add features, feel free to fork and open a pull request!  
Just try to keep things modular and clean.
