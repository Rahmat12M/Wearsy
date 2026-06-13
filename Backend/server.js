import express from "express";
import { register } from "./src/routers/register.js";
import cors from "cors";
import path from 'path';
import { login, Users } from "./src/routers/login.js";
import { createPost, deletePost, getMyAlbums } from "./src/routers/dashboard.js";
import { upload } from "./src/middleware/uploadFoto.js";
import { updateProfile, profile, changePwd, updateProfileP  } from "./src/routers/profile.js";
import { verifyToken } from "./src/middleware/auth.js";
import { fileURLToPath } from "url";
import { logout } from "./src/routers/logout.js";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "./src/routers/notifications.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static( path.join(__dirname, '/uploads')));
console.log('upload dir: ',path.join(__dirname, '/uploads') )

app.post("/register",upload.single('profileImage'), register);
app.post('/login', login);
app.post('/logout', logout);
app.post('/changePwd',verifyToken, changePwd);
app.post('/albums', verifyToken, upload.single('image'), createPost);

app.get('/albums', verifyToken, getMyAlbums);
app.get('/user', verifyToken, Users);
app.get('/profile', verifyToken, profile);
app.get("/notifications", verifyToken, getNotifications);

app.put('/updateProfile',verifyToken, upload.single('profileImage'), updateProfile);
app.put("/profile/avatar", verifyToken, upload.single("avatar"), updateProfileP)

app.delete('/albums/:id', verifyToken, deletePost);

app.patch("/notifications/:id/read", verifyToken, markNotificationRead);
app.patch("/notifications/read-all", verifyToken, markAllNotificationsRead);

app.listen(5000, () => {
  console.log("server running on http://localhost:5000");
});

