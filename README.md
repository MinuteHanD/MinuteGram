# MinuteGram

**MinuteGram** is a modern social media platform built with Spring Boot and React. This is a full-stack development, built with robust RESTful API to creating a dynamic and responsive user interface.

## Core Features

*   **User Authentication:** Secure user registration and login with JWT-based authentication.
*   **Topics:** Create and subscribe to topics of interest.
*   **Posts:** Share text-based posts within topics, with support for image uploads.
*   **Comments:** Engage in discussions through comments on posts.
*   **User Profiles:** View and manage user profiles.
*   **Admin & Moderator Roles:** User roles for content moderation and platform administration.
*   **Cloud-based Image Storage:** Integration with Cloudinary for image uploads.

## Tech Stack

**Backend:**

*   **Framework:** Spring Boot
*   **Language:** Java 17
*   **Database:** PostgreSQL
*   **Authentication:** Spring Security with JWT
*   **ORM:** Spring Data JPA (Hibernate)
*   **File Storage:** Cloudinary

**Frontend:**

*   **Framework:** React
*   **Language:** JavaScript (ES6+)
*   **Styling:** Tailwind CSS
*   **Routing:** React Router
*   **Build Tool:** Vite
*   **API Client:** Axios

## API Endpoints

### Authentication

| Method | Endpoint         | Description                                      |
| ------ | ---------------- | ------------------------------------------------ |
| POST   | `/api/auth/signup` | Register a new user.                             |
| POST   | `/api/auth/login`  | Authenticate a user and receive a JWT.           |
| POST   | `/api/auth/logout` | Log out the current user and invalidate their token. |

### Topics

| Method | Endpoint               | Description                                         |
| ------ | ---------------------- | --------------------------------------------------- |
| POST   | `/api/topics`          | Create a new topic. (Authentication required)       |
| GET    | `/api/topics`          | Get a paginated list of all topics.                 |
| GET    | `/api/topics/{id}`     | Get a specific topic by its ID.                     |
| GET    | `/api/topics/{id}/posts` | Get a paginated list of posts for a specific topic. |

### Posts

| Method | Endpoint               | Description                                                   |
| ------ | ---------------------- | ------------------------------------------------------------- |
| POST   | `/api/posts`           | Create a new post. (Authentication required)                  |
| GET    | `/api/posts`           | Get a paginated list of all posts.                            |
| GET    | `/api/posts/{id}`      | Get a specific post by its ID, including its comments.        |
| POST   | `/api/posts/{id}/like` | Like a post. (Authentication required)                        |
| DELETE | `/api/posts/{id}/like` | Unlike a post. (Authentication required)                      |

### Comments

| Method | Endpoint                   | Description                                       |
| ------ | -------------------------- | ------------------------------------------------- |
| POST   | `/api/comments`            | Create a new comment on a post. (Authentication required) |
| GET    | `/api/comments/post/{postId}` | Get all comments for a specific post.             |
| GET    | `/api/comments/{commentId}/replies` | Get all replies for a specific comment.           |

### Users

| Method | Endpoint           | Description                                       |
| ------ | ------------------ | ------------------------------------------------- |
| GET    | `/api/users/current` | Get the currently authenticated user's profile.     |

### Admin & Moderation

| Method | Endpoint                         | Description                                                              |
| ------ | -------------------------------- | ------------------------------------------------------------------------ |
| GET    | `/api/admin/posts`               | Get a paginated list of all posts. (Admin/Moderator only)                |
| GET    | `/api/admin/comments`            | Get a paginated list of all comments. (Admin/Moderator only)             |
| GET    | `/api/admin/users`               | Get a paginated list of all users. (Admin only)                          |
| GET    | `/api/admin/topics`              | Get a paginated list of all topics. (Admin/Moderator only)               |
| POST   | `/api/admin/users/{userId}/ban`  | Ban a user. (Admin/Moderator only)                                       |
| POST   | `/api/admin/users/{userId}/unban`| Unban a user. (Admin/Moderator only)                                     |
| POST   | `/api/admin/users/{userId}/role` | Update a user's role. (Admin only)                                       |
| DELETE | `/api/admin/posts/{postId}`      | Delete a post. (Admin/Moderator only)                                    |
| DELETE | `/api/admin/comments/{commentId}`| Delete a comment. (Admin/Moderator only)                                 |
| DELETE | `/api/admin/topics/{topicId}`    | Delete a topic. (Admin/Moderator only)                                   |

## Local Development

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/MinuteHanD/MinuteGram.git
    cd MinuteGram
    ```

2.  **Backend Setup:**

    *   Navigate to the root directory.
    *   Create a `.env` file by copying the `.env.example` and fill in the required environment variables.
    *   Start the PostgreSQL database using Docker:

        ```bash
        docker run --name minutegram-postgres -e POSTGRES_DB=minutegram_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:13
        ```

    *   Run the Spring Boot application:

        ```bash
        ./mvnw spring-boot:run
        ```

3.  **Frontend Setup:**

    *   Navigate to the `client` directory:

        ```bash
        cd client
        ```

    *   Install the dependencies:

        ```bash
        npm install
        ```

    *   Create a `.env.local` file and add the following environment variable, pointing to your backend's API URL:

        ```
        VITE_API_BASE_URL=http://localhost:8080
        ```

    *   Start the development server:

        ```bash
        npm run dev
        ```