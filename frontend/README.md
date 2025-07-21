# AI_AGENT Frontend

This is the frontend for the **AI_AGENT** project, built with React, Vite, Tailwind CSS, and React Router. It provides a user-friendly interface for authentication, project management, and collaboration.

## Features

- **User Registration & Login**: Secure authentication with JWT.
- **Project Dashboard**: Create, view, and manage projects.
- **Collaborator Management**: See and add collaborators to projects.
- **Responsive UI**: Styled with Tailwind CSS.
- **API Integration**: Communicates with the backend using Axios.
- **Protected Routes**: Only authenticated users can access project features.
- **Real-time Chat & AI Assistance**: Collaborate and get code help instantly.
- **WebContainer Integration**: Edit and run code in-browser with live preview.

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
- **Real-time Communication (Socket.io):** Chat and collaborate instantly.
- **AI-powered Code Assistance:** Get code suggestions and file structures from the AI assistant.
- **File Explorer & Editor:** Browse and edit project files in-browser.
- **WebContainer Integration:** Run and preview code live in the browser.

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
      ],
      "fileTree": {
        "app.js": { "file": { "contents": "console.log('Hello World');" } }
      }
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
  sendMessage('project-message', { message: 'Hello team!', sender: user });
  ```

- **Receive a Message:**

  ```js
  import { receiveMessage } from '../config/socket';

  receiveMessage('project-message', (data) => {
    // handle incoming data
  });
  ```

- **Example:**

  ```js
  // Connect to socket when project loads
  useEffect(() => {
    const socket = initializeSocket(project._id);

    receiveMessage('project-message', (msg) => {
      console.log('Received:', msg);
    });

    // Cleanup on unmount
    return () => socket.disconnect();
  }, [project._id]);
  ```

---

## AI-powered Code Assistance

- Type a message starting with `@ai` in the chat to get code suggestions, file structures, or answers from the AI assistant.
- The backend processes the prompt and returns a formatted response, which is rendered in the chat with syntax highlighting.

**Example Usage:**

Type in chat:
```
@ai Create a REST API with Express and MongoDB
```

**Example AI Response:**
```json
{
  "text": "Here is a basic Express REST API setup...",
  "fileTree": {
    "app.js": { "file": { "contents": "const express = require('express'); ..." } },
    "package.json": { "file": { "contents": "{ \"name\": \"rest-api\", ... }" } }
  }
}
```
The response will be rendered with Markdown and code highlighting in the chat.

---

## File Explorer & Code Editor

- **Explorer Panel:** Shows the file tree structure for the project.
- **Code Editor:** Allows editing code with syntax highlighting (powered by `highlight.js`).
- **Open Files Tabs:** Switch between multiple open files.

**Example Usage:**

- Click a file in the explorer to open it.
- Edit code in the code editor area; changes are saved to the file tree and synced to the backend.

---

## WebContainer Integration

The frontend supports **in-browser code execution and file management** using [WebContainer](https://webcontainer.io/). This allows users to view, edit, and run code directly in the browser, making the project workspace interactive and collaborative.

### How It Works

- The WebContainer instance is initialized in `src/config/webContainer.js`.
- When a project is opened, the file tree received from the backend or AI assistant is mounted into the WebContainer.
- Users can view and edit code files in the browser. Changes are reflected in the file tree and can be shared with collaborators in real-time.
- You can run the project (e.g., install dependencies and start the server) and preview the result in an embedded iframe.

**Example Usage:**

**Initialize WebContainer:**
```js
import { getWebContainer } from '../config/webContainer';

useEffect(() => {
  getWebContainer().then(container => {
    setWebContainer(container);
    console.log("Container started");
  });
}, []);
```

**Mount File Tree:**
```js
webContainer.mount(fileTree);
```

**Run Project:**
```js
const installProcess = await webContainer.spawn("npm", ["install"]);
const runProcess = await webContainer.spawn("npm", ["start"]);
webContainer.on('server-ready', (port, url) => {
  setIframeUrl(url);
});
```

---

### Example Workflow

1. **Open a project** to load the file tree.
2. **Click a file** to view and edit its contents.
3. **Edit code** in the browser; changes are saved and can be shared.
4. **Run the project** and preview the output in-browser.
5. **Collaborate** with others in real-time using chat and file updates.

---

## Related Files

- `src/screens/Project.jsx` — Main project workspace.
- `src/config/socket.js` — Socket.io client logic.
- `src/config/webContainer.js` — WebContainer integration for code execution.

---

## Styling

- **Tailwind CSS** is used for rapid UI development.
- Custom styles can be added in `src/App.css` and `src/index.css`.

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
- **WebContainer issues:** Ensure your browser supports WebContainer and you are using a compatible environment.

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

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and