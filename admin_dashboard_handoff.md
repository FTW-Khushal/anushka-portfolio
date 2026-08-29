# Admin Dashboard Handoff Document

This document outlines the architecture, data models, and implementation steps for building the new **Portfolio CMS / Admin Dashboard**. Provide this document to the AI in your new session so they have full context on what to build.

## Architecture & Tech Stack
- **Frontend Framework**: Vue 3 + Vite (Keeps the ecosystem consistent with the main portfolio).
- **Styling**: TailwindCSS (Recommended for rapid, clean dashboard UI development).
- **Database & Auth**: Firebase (Firestore for NoSQL database, Firebase Auth for Admin Login).
- **Image Storage**: Cloudinary (Using the Cloudinary Upload Widget to easily upload images and extract dimensions).

## Core Features to Build
1. **Admin Authentication**: A secure login page using Firebase Authentication (Email/Password). Only the admin should be able to access the dashboard.
2. **Cloudinary Upload Integration**: Use the standard Cloudinary Upload Widget. This is critical because the widget automatically returns the `width`, `height`, and `secure_url` of the uploaded image, which the portfolio needs for dynamic grid spans and masonry layouts.
3. **Projects CRUD (Work Data)**: Interface to Create, Read, Update, and Delete projects.
4. **Moments CRUD (Moments Data)**: Interface to manage the images used in the footer tapestry.

## Database Schema (Firestore)

### Collection: `projects` (Replaces `workData.js`)
Documents in this collection should have the following fields:
- `title` (String)
- `category` (String) - e.g., 'vfx', 'art-design', 'photography'
- `subCategory` (String) - e.g., 'Typography', 'Architecture' (Optional)
- `categoryName` (String) - e.g., 'Art & Design'
- `year` (String)
- `description` (String)
- `image` (String) - The Cloudinary secure URL
- `video` (String) - Optional video URL
- `width` (Number) - Extracted from Cloudinary
- `height` (Number) - Extracted from Cloudinary
- `createdAt` (Timestamp) - For sorting

### Collection: `moments` (Replaces `momentsData.js`)
Documents in this collection should have the following fields:
- `title` (String)
- `category` (String)
- `caption` (String)
- `image` (String) - The Cloudinary secure URL
- `width` (Number) - Extracted from Cloudinary
- `height` (Number) - Extracted from Cloudinary
- `createdAt` (Timestamp) - For sorting

## Implementation Steps for the New Session
1. **Initialize the Project**: Create a new Vue 3 + Vite project and install `firebase`, `vue-router`, and TailwindCSS.
2. **Setup Firebase**: Create a `firebase.js` config file. Enable Firestore and Authentication in the Firebase Console.
3. **Setup Cloudinary**: Create an unsigned upload preset in the Cloudinary dashboard so the frontend widget can upload files without a backend server.
4. **Build the Auth Flow**: Create a Login view and set up router guards so the dashboard routes are protected.
5. **Build the Dashboard**: Create tables/grids to list `projects` and `moments`.
6. **Build the Forms**: Create the "Add/Edit" forms. Integrate the Cloudinary widget button inside these forms so images can be uploaded before saving the document to Firestore.

> [!TIP]
> Tell the AI: *"I want to use the official Cloudinary Upload Widget script in Vue, because it automatically gives us the width and height of the image in the success result."*
