# Country Communication

## Introduction

Country Communication is a modern full-stack web application built using Next.js, React, and TypeScript.  
The project integrates authentication, cloud media management, animations, markdown processing, and database connectivity to create a scalable communication platform.

The application uses modern frontend technologies with backend API integration and MongoDB support.

---

# Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Media Management](#media-management)
- [Markdown Support](#markdown-support)
- [UI & Animations](#ui--animations)
- [Linting](#linting)
- [Deployment](#deployment)
- [Dependencies](#dependencies)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)
- [License](#license)
- [Contributors](#contributors)

---

# Features

- ⚡ Built with Next.js 16 and React 19
- 🎨 Tailwind CSS 4 styling support
- 🔐 JWT Authentication
- 🔑 Password hashing using bcryptjs
- ☁️ Cloudinary media upload integration
- 📦 MongoDB database integration with Mongoose
- 🎞️ Smooth animations with Framer Motion
- 📝 Markdown content parsing and rendering
- 🔔 Toast notifications and alert dialogs
- 📱 Responsive UI components
- 🎠 Swiper slider integration
- 🌐 API handling with Axios

---

# Tech Stack

## Frontend

- React 19
- Next.js 16
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Swiper
- Lucide React

## Backend / Utilities

- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- Axios
- Cloudinary
- dotenv
- nanoid

---

# Installation

## Prerequisites

Make sure you have installed:

- Node.js (18+ recommended)
- npm or yarn
- MongoDB database

---

## Clone the Repository

```bash
git clone <repository-url>
cd country_communication
```

---

## Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```env
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

# Running the Project

## Development Mode

```bash
npm run dev
```

Runs the app locally at:

```bash
http://localhost:3000
```

---

## Production Build

```bash
npm run build
```

## Start Production Server

```bash
npm run start
```

---

# Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts development server |
| `npm run build` | Builds application for production |
| `npm run start` | Starts production server |
| `npm run lint` | Runs ESLint checks |

---

# Project Structure

```bash
country_communication/
│
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/                 # Utility and helper functions
├── models/              # Mongoose models
├── public/              # Static assets
├── styles/              # Global styles
├── api/                 # API routes
├── types/               # TypeScript type definitions
├── middleware.ts        # Authentication middleware
├── next.config.ts       # Next.js configuration
└── .env.local           # Environment variables
```

---

# Authentication

The project uses:

- JSON Web Tokens (JWT) for authentication
- bcryptjs for secure password hashing

Authentication flow may include:

- User Registration
- User Login
- Protected Routes
- Token Verification

---

# Media Management

Cloudinary is used for:

- Image uploads
- Media storage
- Optimized image delivery
- CDN-based asset management

---

# Markdown Support

Markdown files are processed using:

- gray-matter
- remark
- remark-html

Useful for:

- Blog systems
- Documentation pages
- Dynamic content rendering

---

# UI & Animations

The application includes:

- Framer Motion animations
- React Awesome Reveal transitions
- Swiper sliders
- SweetAlert2 popups
- React Toastify notifications

---

# Linting

Run ESLint checks using:

```bash
npm run lint
```

---

# Deployment

You can deploy the project on platforms such as:

- Vercel
- Netlify
- Railway
- Render

---

# Dependencies

## Main Dependencies

| Package | Purpose |
|---------|----------|
| next | React framework |
| react | UI library |
| react-dom | React rendering |
| mongoose | MongoDB ORM |
| axios | HTTP requests |
| cloudinary | Media management |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| framer-motion | Animations |
| swiper | Slider functionality |
| react-toastify | Notifications |
| sweetalert2 | Alert modals |

---

## Dev Dependencies

| Package | Purpose |
|---------|----------|
| typescript | Type safety |
| eslint | Code linting |
| tailwindcss | Utility-first CSS |
| eslint-config-next | Next.js linting config |

---

# Browser Support

```json
"> 1%"
```

Supports modern browsers with more than 1% global usage.

---

# Troubleshooting

## Port Already in Use

```bash
lsof -i :3000
kill -9 <PID>
```

---

## MongoDB Connection Error

- Verify `MONGODB_URI`
- Ensure MongoDB server is running
- Check database network access

---

## Cloudinary Upload Issues

- Check Cloudinary credentials
- Ensure API keys are correct
- Verify upload presets if used

---

## Build Errors

```bash
npm run lint
```

Then fix TypeScript or ESLint issues.

---

# Future Improvements

- Role-based authentication
- Real-time messaging
- Multi-language support
- Admin dashboard
- Notification system
- API rate limiting
- Dark mode support
- User profile management

---

# License

This project is private and currently not licensed for public distribution.

---

# Contributors

Developed by the Country Communication Team.

---

# Official Technologies Used

- Next.js → https://nextjs.org
- React → https://react.dev
- Tailwind CSS → https://tailwindcss.com
- MongoDB → https://www.mongodb.com
- Cloudinary → https://cloudinary.com