# Tribute Website – Vse Olanrewaju Macaulay (1959 – 2026)

A clean, elegant memorial website created with **HTML / CSS / Vanilla JavaScript + Firebase**.

---

## 📁 Files in this folder

- **`index.html`** &rarr; Double-click to open and view the website in any browser.
- **`style.css`** &rarr; Complete styling (warm dark hero, clean parchment cream body, warm subtle gold accents).
- **`app.js`** &rarr; Interactive logic for lighting candles, submitting condolences, uploading throwback photos with lightbox zoom, and social sharing.
- **`firebase-config.js`** &rarr; Place your Firebase API keys here when you are ready to enable cloud persistence.
- **`portrait.jpg`** &rarr; *(Optional)* Add a photo of Vse Olanrewaju Macaulay with this exact name in this folder.

---

## 🕯️ Included Features

1. **Hero Section**: Dignified dark header with photo ring placeholder, name, dates (1959 – 2026), and memorial quote.
2. **Candle Lighting**: Animated flickering candlelight with a real-time count that increments when visitors light a candle.
3. **Memorial Timeline**: Life milestones displayed in an alternating timeline layout.
4. **Condolences Wall**: Interactive form allowing visitors to leave their name and a condolence message.
5. **Throwback Photo Gallery**: Upload throwback images with an interactive lightbox overlay for zooming in.
6. **Social Sharing**: Direct share buttons for WhatsApp, Facebook, Twitter/X, and 1-click Link Copying.

---

## 🚀 Connecting to Firebase (Optional, for Live Multi-User Sync)

The website works immediately out-of-the-box (saving messages and uploaded photos locally in the browser). To sync condolences and photos across everyone visiting the site:

1. Visit [Firebase Console](https://console.firebase.google.com).
2. Click **Create a project**.
3. Under Project Overview, click the **Web icon `</>`** and register your app.
4. Copy the config keys and paste them into `firebase-config.js`.
5. Under **Build**:
   - Enable **Firestore Database** (start in Test mode).
   - Enable **Storage** (start in Test mode).
