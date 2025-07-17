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
## Features

- **View Project Details:** See the project name and its collaborators.
- **Add Collaborators:** Add other users to your project.
- **Side Panel:** View a list of all collaborators in a project.
- **Chat UI (UI only):** Placeholder for future messaging features.
- **Real-time Communication (Socket.io ready):** Socket setup for future chat/collaboration.

---

## How It Works

### 1. Viewing a Project

When you click on a project from the Home screen, you are navigated to the Project screen. The project details and collaborators are fetched from the backend.

- **API Call:**  
  ```sh
  GET /projects/get-project/:projectId
  ```
- **Example Response:**
  ```json
  {
    "project": {
      "_id": "project_id",
      "name": "my first project",
      "users": [
        { "_id": "user_id", "email": "user@example.com" },
        { "_id": "collaborator_id", "email": "collab@example.com" }
      ]
    }
  }
  ```

---

### 2. Viewing Collaborators

Click the group icon in the top-right to open the side panel.  
All collaborators for the project are listed here.

---

### 3. Adding Collaborators

1. Click **Add collaborator**.
2. A modal opens with a list of users (excluding yourself).
3. Select one or more users.
4. Click **Add Collaborators**.

- **API Call:**  
  ```sh
  PUT /projects/add-user
  ```
- **Request Body Example:**
  ```json
  {
    "projectId": "project_id",
    "users": ["collaborator_id_1", "collaborator_id_2"]
  }
  ```
- **Example cURL:**
  ```sh
  curl -X PUT http://localhost:3000/projects/add-user \
    -H "Authorization: Bearer <JWT_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"projectId":"project_id","users":["collaborator_id_1","collaborator_id_2"]}'
  ```
- **Response Example:**
  ```json
  {
    "_id": "project_id",
    "name": "my first project",
    "users": [
      "user_id",
      "collaborator_id_1",
      "collaborator_id_2"
    ]
  }
  ```

---

## Real-time Communication (Socket.io)

The frontend is ready for real-time features (like chat or live collaboration) using Socket.io. When a user opens a project, a socket connection is established for that project. This enables instant messaging between collaborators in the same project room.

- **Live Chat:** Users can send and receive messages in real-time.
- **Collaboration Ready:** The socket setup allows for future features like notifications, collaborative editing, and live updates.
- **Room-based Messaging:** Only users in the same project receive messages and updates.
Socket logic is in `src/config/socket.js`.

### Socket Usage

- **Initialize Socket Connection:**

  ```js
  import { initializeSocket } from '../config/socket';

  const socket = initializeSocket(projectId);
  ```

- **Send a Message:**

  ```js
  import { sendMessage } from '../config/socket';
  sendMessage('eventName', { message: 'Hello' });
  ```

- **Receive a Message:**

  ```js
  import { receiveMessage } from '../config/socket';

  receiveMessage('eventName', (data) => {
    // handle incoming data
  });
  ```

- **Example:**

  ```js
  // Connect to socket when project loads
  useEffect(() => {
    const socket = initializeSocket(project._id);

    receiveMessage('chat', (msg) => {
      console.log('Received:', msg);
      });

    // Cleanup on unmount
    return () => socket.disconnect();
  }, [project._id]);
  ```

---

## UI Structure

- **Left Panel:** Project info, chat placeholder, and collaborator side panel.
- **Main Area:** (Extendable for chat, tasks, etc.)
- **Modal:** For selecting and adding collaborators.

---

## Example Workflow

1. **Open a project** from the dashboard.
2. **View collaborators** in the side panel.
3. **Add new collaborators** using the modal.
4. **See the updated list** of collaborators instantly.

---

## Notes

- Only authenticated users can access this screen.
- Collaborator management is done via user IDs.
- The chat area is currently a UI placeholder.

---

## Related API Endpoints

- `GET /projects/get-project/:projectId` — Get project details.
- `PUT /projects/add-user` — Add collaborators to a project.
- `GET /users/all` — List all users (for adding as collaborators).

---

## Example: Add Collaborator Flow

1. **User opens project:**  
   Project details and collaborators are loaded.

2. **User clicks "Add collaborator":**  
   Modal opens with user list.

3. **User selects users and submits:**  
   API call is made to add users.

4. **Collaborators list updates:**  
   Side panel shows new collaborators.

---

## Styling

- **Tailwind CSS** is used for rapid UI development.
- Custom styles can be added in `src/App.css` and `src/index.css`.

---

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

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your