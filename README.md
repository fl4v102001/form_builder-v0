# Form Builder

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Overview

This project is a **Form Builder** web application built with Next.js and React. It allows users to create, edit, and organize forms composed of multiple sections and questions. The application supports various question types and provides a modern, interactive UI for building custom forms.

### Core Features

- **Dynamic Form Creation**: Users can add, remove, and reorder sections and questions within a form.
- **Question Types**: Supports multiple question types, including:
  - Short Answer (with validation on the length of the text)
  - Paragraph
  - Multiple Choice
  - Checkboxes
  - Dropdown
  - Date
  - Number (with validation for integers and set)
- **UI/UX**: Utilizes Material UI and custom UI components for a modern, interactive experience.
- **State Management**: Uses React state to manage the form structure and updates in real time.
- **Persistence**: Integration with a backend or local storage for saving and updating forms.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

- **`app/`**: Contains the main application logic and pages.
- **`components/`**: Contains reusable UI components, including the `FormBuilder` and `QuestionBuilder`.
- **`types/`**: Contains TypeScript interfaces and enums for the form data structure.
- **`public/`**: Contains static assets.
- **`styles/`**: Contains global styles and Tailwind CSS configuration.

## How It Works

1. **Project Type & Stack**: This is a Next.js project using TypeScript, Tailwind CSS, Material UI, and several UI libraries (Radix UI, shadcn/ui, MUI, etc.).
2. **Core Functionality**: The project is a Form Builder web application. Users can create, edit, and organize forms composed of multiple sections and questions.
3. **Key Features**: Dynamic form creation, various question types, modern UI/UX, state management, and persistence.
4. **How It Works**: The main page initializes a blank form and renders the `FormBuilder` component, allowing users to edit the form title, add/remove/reorder sections and questions, and choose question types.
5. **Intended Use Case**: This project is intended for users who want to build custom forms (like surveys, quizzes, or data collection forms) via a web interface, without coding.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

