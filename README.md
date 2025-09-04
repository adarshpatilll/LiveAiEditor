
# Live AI Collaborative Editor

A **real-time collaborative editor** with AI assistant, AI-powered text edits, and agent-enabled web search using Talivy. Built with **React.js**, **Tiptap**, **Tailwind CSS**, and **Firebase**.

## Features

- **Real-time Editor**: Collaborative text editing using Firebase Firestore.
- **Chat Sidebar**: Talk to an AI assistant and insert suggestions into the editor.
- **Floating Toolbar**: Select text to apply AI actions like grammar fixes, shorten/expand, or convert to table.
- **Agent Mode**: AI can search the web (via Talivy) and summarize results directly into the editor.
- **Document Context**: Option to use the current editor content as context for AI responses.

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/adarshpatilll/LiveAiEditor.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables in `.env`

```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_TAVILY_API_KEY=your_tavily_api_key
VITE_GEMINI_KEY=your_gemini_api_key
```

### 4. Run locally

```bash
npm run dev
```


## Usage

* Type and edit text collaboratively in the editor.
* Use Floating Toolbar to apply AI edits.
* Chat Sidebar: Ask questions, toggle "Use document context" or "Agent mode".
* Insert AI suggestions into the editor with "+ Insert to Editor" button.

## Notes

* Firebase handles real-time collaboration; edits are live.
* Talivy is used for agent web search and summarization.
* `node_modules` is not included; run `npm install` after downloading.
