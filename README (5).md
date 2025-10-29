# Choice TV - Advanced Free Streaming Platform

Welcome to **Choice TV**—your complete, open-source platform for free streaming, movies, music, education, and more! This project uses **Firebase v9+**, **Vanilla JS**, and is ready for advanced extensions with **React**, **Node.js**, extra CSS frameworks, and more.

---

## 🌟 Features

- 50+ Free streaming channel links (Pluto TV, Tubi, Plex, etc.)
- Latest African, American, and Netflix free movies (redirects)
- Free music, news, educational links
- **Admin-only upload center** (Firebase Auth & Storage)
- Dynamic display of your uploaded content (movies, music, news, educational)
- Ready for GitHub Pages or Firebase Hosting
- Extensible for Node.js, React, advanced CSS, and more!

---

## 🚀 Getting Started

### 1. **Clone the Repo**

```bash
git clone https://github.com/yourusername/choicetv.git
cd choicetv
```

### 2. **Frontend Setup**

- `index.html` is your main homepage.
- `main.js` handles all advanced frontend logic.
- Link it in your HTML:  
  `<script type="module" src="main.js"></script>`

### 3. **Firebase Setup**

- Create your Firebase project, enable Authentication, Storage, and Firestore.
- Fill in your config in `main.js` or use the included credentials for testing.

### 4. **Admin Uploads**

- Only the admin email (update in `main.js`) can upload content.
- Uploaded files (movies, music, etc.) are stored in Firebase Storage and displayed dynamically.

---

## 🧑‍💻 Advanced Extensions

### **Node.js API Example (Express, REST)**
Create `server.js`:

```javascript name=server.js
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Example endpoint for uploads
app.get('/api/uploads', (req, res) => {
  // Integrate with Firebase Admin SDK or Firestore REST API here
  res.json({message: "Advanced Node.js API here"});
});

app.listen(5000, () => console.log('Server running on port 5000'));
```

### **React Integration Example**
Create `src/App.js`:

```jsx name=src/App.js
import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = { /* ... */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    async function fetchUploads() {
      const querySnapshot = await getDocs(collection(db, "user_uploads"));
      setUploads(querySnapshot.docs.map(doc => doc.data()));
    }
    fetchUploads();
  }, []);

  return (
    <div>
      <h1>Choice TV React Frontend</h1>
      {uploads.map((item, idx) => (
        <div key={idx}>
          <h2>{item.title}</h2>
          {item.type === "movie" && <video src={item.url} controls />}
          {item.type === "music" && <audio src={item.url} controls />}
        </div>
      ))}
    </div>
  );
}
```

### **Custom CSS Example**
Add `custom.css` for more styles:

```css name=custom.css
body {
  background: linear-gradient(135deg, #111 60%, #3182ce 100%);
}
.channel-card:hover {
  box-shadow: 0 0 10px #3182ce;
  transform: scale(1.02);
}
.button {
  transition: background 0.2s, transform 0.2s;
}
```

---

## 🔗 Deployment

- **GitHub Pages**: Just push your files, set up GitHub Pages from your repo settings.
- **Firebase Hosting**:  
  ```bash
  npm install -g firebase-tools
  firebase login
  firebase init hosting
  firebase deploy
  ```

---

## 💡 More Advancements

- **Add Chat/Comments**: Use Firebase Realtime DB or Firestore.
- **Social Sharing**: Add share buttons for uploads.
- **Analytics Dashboard**: Use Firebase Analytics or integrate with Google Analytics.
- **Multi-admin**: Add more emails in `main.js`.
- **Dark/Light Mode**: Use CSS variables or frameworks like Tailwind/Bootstrap.
- **PWA Support**: Add `manifest.json` and service worker for offline use.
- **Internationalization**: Add translation files or use i18n libraries.

---

## 👨‍🔧 Contributing

Pull requests, issues, and feature ideas are welcome!

---

## 📧 Contact

For admin access or support, email: **sokpahakinsaye@gmail.com**

---

## 📜 License

MIT

---
