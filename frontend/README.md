# AI_AGENT Frontend

This is the frontend for the **AI_AGENT** project, built with React, Vite, Tailwind CSS, and React Router. It provides a user-friendly interface for authentication, project management, and collaboration.

## Features

- **User Registration & Login**: Secure authentication with JWT.
- **Project Dashboard**: Create, view, and manage projects.
- **Collaborator Management**: See and add collaborators to projects.
- **Responsive UI**: Styled with Tailwind CSS.
- **API Integration**: Communicates with the backend using Axios.
- **Protected Routes**: Only authenticated users can access project features.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Backend API running (see backend README)

### Installation

1. Clone the repository:

   ```sh
   git clone <your-repo-url>
   cd frontend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```
   VITE_API_URL=http://localhost:3000
   ```

   Adjust the URL to match your backend server.

4. Start the development server:

   ```sh
   npm run dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173) (default Vite port).

---


---

## Main Components & Screens

### 1. Authentication

#### Register

- **Screen:** `src/screens/Register.jsx`
- **Example Usage:**

  Fill in your email and password, then click **Register**.  
  On success, you are redirected to the home page.

  ```sh
  # Example API call (handled by frontend)
  POST /users/register
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```

#### Login

- **Screen:** `src/screens/Login.jsx`
- **Example Usage:**

  Enter your credentials and click **Login**.  
  On success, you are redirected to the home page.

  ```sh
  # Example API call (handled by frontend)
  POST /users/login
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```

---

### 2. Home (Project Dashboard)

- **Screen:** `src/screens/Home.jsx`
- **Features:**
  - View all your projects.
  - Create a new project.
  - Click a project to view details.

- **Example Usage:**

  - **Create Project:**  
    Click "New Project", enter a name, and submit.

    ```sh
    # Example API call
    POST /projects/create
    {
      "name": "My First Project"
    }
    ```

  - **List Projects:**  
    Projects are fetched automatically on page load.

    ```sh
    # Example API call
    GET /projects/all
    ```

---

### 3. Project Details

- **Screen:** `src/screens/Project.jsx`
- **Features:**
  - View project details and collaborators.
  - (Extendable: Add/remove collaborators, manage tasks, etc.)

---

## API Integration

- **Axios Configuration:**  
  Located in `src/config/axios.js`.  
  Automatically attaches JWT token from `localStorage` to requests.

  ```js
  const axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
  })
  ```

---

## Styling

- **Tailwind CSS** is used for rapid UI development.
- Custom styles can be added in `src/App.css` and `src/index.css`.

---

## Example Workflow

1. **Register a new user**
2. **Login with your credentials**
3. **Create a new project**
4. **View your projects on the dashboard**
5. **Click a project to see details**

---

## Environment Variables

Create a `.env` file in the root:

```
VITE_API_URL=http://localhost:3000
```

---

## Troubleshooting

- **API errors:** Ensure the backend is running and the URL in `.env` is correct.
- **Authentication issues:** Check that JWT tokens are stored in `localStorage`.
- **Styling issues:** Make sure Tailwind CSS is installed and configured.

---

## License

ISC

---

## React Documentation Details

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

