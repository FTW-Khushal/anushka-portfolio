# Admin Dashboard Handoff Document

This document outlines the architecture, data models, and implementation steps for building the new **Portfolio CMS / Admin Dashboard**. Provide this document to the AI in your new session so they have full context on what to build.

## Architecture & Tech Stack
- **Frontend Framework**: Vue 3 + Vite (Keeps the ecosystem consistent with the main portfolio).
- **Styling**: TailwindCSS (Recommended for rapid, clean dashboard UI development).
- **Database & Auth**: Firebase (Firestore for NoSQL database, Firebase Auth for Admin Login).
- **Image Storage**: Cloudinary (Using the Cloudinary Upload Widget to easily upload images and extract dimensions).

## Core Features to Build
1. **Admin Authentication (Code-Based)**: Instead of standard email/password, implement a code-based authentication system. Since there are only two users (the maintainer and the client), you can use an Authenticator App (like Google Authenticator / TOTP) to generate a login code, or build a simple 2FA/Custom Auth flow in Firebase that only allows access if the correct time-based or pre-generated code is entered.
2. **Cloudinary Upload Integration**: Use the standard Cloudinary Upload Widget. This is critical because the widget automatically returns the `width`, `height`, and `secure_url` of the uploaded image, which the portfolio needs for dynamic grid spans and masonry layouts.
3. **Projects CRUD (Work Data)**: Interface to Create, Read, Update, and Delete projects.
4. **Dynamic Categories Management**: The dashboard must include a feature to dynamically add, edit, or delete categories (and sub-categories) so the user doesn't have to manually type them in every time.
5. **Moments CRUD & Live Preview**: Interface to manage the images used in the footer tapestry. Because the Moments tapestry relies on a specific masonry layout (wide vs tall vs square based on width/height), the dashboard **must include a live preview component** that mimics the actual website's tapestry layout so the user can see exactly how the images will pack together before publishing.

## Firebase Firestore Schema

### Collection: `categories`
To support dynamic category selection, create a collection to store them:
- `id` (Document ID)
- `name` (String) - e.g., 'VFX Artist', 'Art & Design'
- `slug` (String) - e.g., 'vfx', 'art-design'
- `subCategories` (Array of Strings) - e.g., ['Typography', 'Architecture']

### Collection: `projects` (Replaces `workData.js`)
Documents in this collection should have the following fields:
- `title` (String)
- `category` (Reference or String) - e.g., 'vfx', 'art-design', 'photography'
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
2. **Setup Firebase**: Create a `firebase.js` config file. Enable Firestore and set up the custom Code/Authenticator-based Authentication.
3. **Setup Cloudinary**: Create an unsigned upload preset in the Cloudinary dashboard so the frontend widget can upload files without a backend server.
4. **Build the Auth Flow**: Create a Login view where the user enters their generated code to authenticate.
5. **Build the Dashboard & Categories**: Create the main layout and a page to manage the dynamic `categories` collection.
6. **Build the Forms**: Create the "Add/Edit" forms for Projects and Moments. Integrate the Cloudinary widget button inside these forms.
7. **Build the Moments Preview**: Recreate a simplified version of the portfolio's masonry grid logic inside the CMS so the user can preview the tapestry.

> [!TIP]
> Tell the AI: *"I want to use the official Cloudinary Upload Widget script in Vue, because it automatically gives us the width and height of the image in the success result."*
