# Email Writer - React Frontend

This directory contains the React frontend for the AI Email Reply Generator. It's a single-page application built with [Vite](https://vitejs.dev/) and [Material-UI](https://mui.com/).

## Features

-   Provides a UI to input email content and select a tone.
-   Communicates with the backend service to generate email replies.
-   Displays the generated response with a "Copy to Clipboard" feature.
-   Designed to be embedded within the Chrome Extension or run as a standalone web application.

## Development

To run the frontend in a local development environment, follow these steps.

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 20.x or later)
-   The [backend service](https://github.com/your-username/your-repo-name/tree/main/email-writer-sb) must be running separately.

### Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd gmail-ai-reply-generator/email-writer-react
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env.development.local` file by copying `.env.example`. Set the `VITE_API_BASE_URL` to point to your running backend (e.g., `http://localhost:8080`).
    ```
    VITE_API_BASE_URL=http://localhost:8080
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Available Scripts

-   `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
-   `npm run build`: Bundles the application for production into the `dist` directory.
-   `npm run lint`: Lints the source code using ESLint.
-   `npm run preview`: Serves the production build locally to preview it.
