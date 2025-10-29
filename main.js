// Firebase Modular v9+ imports for advanced features
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDN-xFOjhGnyQn9NNiItdMNKMXhNYPz2aU",
  authDomain: "choice-tv-6fb5a.firebaseapp.com",
  projectId: "choice-tv-6fb5a",
  storageBucket: "choice-tv-6fb5a.appspot.com",
  messagingSenderId: "809211007051",
  appId: "1:809211007051:web:bb2e01e78978660b8dfdce",
  measurementId: "G-14EVNGW3CC"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

const ADMIN_EMAIL = "sokpahakinsaye@gmail.com"; // Change as needed

// Auth UI
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const uploadSection = document.getElementById("upload-section");

if (loginBtn) loginBtn.onclick = () => signInWithPopup(auth, provider);
if (logoutBtn) logoutBtn.onclick = () => signOut(auth);

onAuthStateChanged(auth, user => {
  if (user && user.email === ADMIN_EMAIL) {
    uploadSection.classList.remove("hidden");
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
  } else {
    uploadSection.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
  }
});

// Upload logic
const uploadForm = document.getElementById("uploadForm");
uploadForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const type = document.getElementById("type").value;
  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;
  const file = document.getElementById("file").files[0];
  const status = document.getElementById("upload-status");
  status.innerText = "Uploading...";
  try {
    const storage_path = `${type}/${Date.now()}_${file.name}`;
    const fileRef = storageRef(storage, storage_path);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    await addDoc(collection(db, "user_uploads"), {
      type, title, desc, url,
      createdAt: new Date().toISOString(),
      uploader: auth.currentUser.email
    });
    status.innerText = "Upload successful!";
    uploadForm.reset();
    loadUserUploads();
  } catch (err) {
    status.innerText = "Upload failed: " + err;
  }
});

// Display uploads
async function loadUserUploads() {
  const listDiv = document.getElementById("my-uploads-list");
  listDiv.innerHTML = "";
  if (!auth.currentUser || auth.currentUser.email !== ADMIN_EMAIL) return;
  const q = query(collection(db, "user_uploads"),
    where("uploader", "==", ADMIN_EMAIL),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    const data = doc.data();
    let card = document.createElement("div");
    card.className = `${data.type}-card`;
    card.innerHTML = `<h3 class="font-semibold mb-2">${data.title}</h3>
      <p>${data.desc || ""}</p>
      ${data.type === "movie" || data.type === "educational" ? `<video controls src="${data.url}"></video>` : ""}
      ${data.type === "music" ? `<audio controls src="${data.url}"></audio>` : ""}
      ${data.type === "news" ? `<video controls src="${data.url}"></video>` : ""}
      <p class="text-xs text-gray-400">Uploaded: ${new Date(data.createdAt).toLocaleString()}</p>`;
    listDiv.appendChild(card);
  });
}
onAuthStateChanged(auth, loadUserUploads);

// Show latest uploads in public sections
async function showPublicUploads(type, containerId) {
  const div = document.getElementById(containerId);
  if (!div) return;
  div.innerHTML = "";
  const q = query(collection(db, "user_uploads"),
    where("type", "==", type),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    const data = doc.data();
    let card = document.createElement("div");
    card.className = `${type}-card`;
    card.innerHTML = `<h3 class="font-semibold mb-2">${data.title}</h3>
      <p>${data.desc || ""}</p>
      ${type === "movie" || type === "educational" ? `<video controls src="${data.url}"></video>` : ""}
      ${type === "music" ? `<audio controls src="${data.url}"></audio>` : ""}
      ${type === "news" ? `<video controls src="${data.url}"></video>` : ""}
      <p class="text-xs text-gray-400">Uploaded by admin</p>`;
    div.appendChild(card);
  });
}
showPublicUploads("movie", "user-movies");
showPublicUploads("music", "user-music");
showPublicUploads("news", "user-news");
showPublicUploads("educational", "user-educational");

// Example: Add advanced search/filter
export function filterUploads(type, keyword) {
  // You can implement advanced filter logic here, e.g. search for title or description
}
