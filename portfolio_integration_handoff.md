# Portfolio Integration Handoff Document

This document outlines the steps required to integrate this existing Vue 3 portfolio with the newly created Firebase backend. Provide this document to the AI in a future session when you are ready to replace the hardcoded data files.

## Goal
Replace the static data arrays in `src/config/workData.js` and `src/config/momentsData.js` with live data fetched from Firebase Firestore.

## Integration Steps

1. **Install Firebase SDK**
   ```bash
   npm install firebase
   ```

2. **Initialize Firebase in the Portfolio**
   Create a new file: `src/config/firebase.js` (or `src/services/firebase.js`).
   - Add the Firebase configuration object (you will get this from your Firebase console).
   - Export the initialized `db` (Firestore instance).

3. **Create a Data Fetching Composable (Optional but Recommended)**
   Create a composable like `src/composables/usePortfolioData.js` to handle the asynchronous fetching logic:
   - Create reactive `ref`s for `projects`, `moments`, and `isLoading`.
   - Write a function `fetchData()` that uses Firestore's `getDocs(collection(db, 'projects'))` to pull the live data.
   - Map the Firestore documents to include the `id` field.

4. **Update the UI Components**
   Currently, components like `GalleryPage.vue`, `VisualEffectsPage.vue`, and `FooterSection.vue` directly import the static arrays.
   - Refactor these components to use `onMounted` to fetch the data (or pull from a global store/composable).
   - Add a loading state (e.g., a cinematic spinner or skeleton loader) while the data is fetching.

5. **Deprecate Static Files**
   Once the integration is complete and verified, the static arrays inside `workData.js` and `momentsData.js` can be safely deleted. 

> [!IMPORTANT]
> The portfolio frontend relies heavily on the `width` and `height` properties for the masonry layouts and grid spans. Ensure that the Firebase data being fetched correctly includes these fields (which should have been populated by Cloudinary in the Admin Dashboard).
