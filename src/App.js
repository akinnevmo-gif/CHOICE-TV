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
