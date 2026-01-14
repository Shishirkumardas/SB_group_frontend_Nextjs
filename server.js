// // server.js (Node.js + Express example)
// const express = require("express");
// const jwt = require("jsonwebtoken");
// const app = express();
//
// app.use(express.json());
// const SECRET_KEY = "your-very-long-random-super-secret-key-at-least-64-characters-2025";
//
// // Mock user data (from your Excel, map users and roles)
// const users = {
//     "admin@sbgroup.com": { password: "adminpass", role: "ADMIN" },
//     // "user@example.com": { password: "userpass", role: "CUSTOMER" },
// };
//
// // Login route to issue token
// app.post("http://localhost:8080/api/auth/login", (req, res) => {
//     const { email, password } = req.body;
//     const user = users[email];
//     if (!user || user.password !== password) {
//         return res.status(401).json({ message: "Invalid credentials" });
//     }
//     const token = jwt.sign({ email, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
//     res.json({ token });
// });
//
// // Middleware to verify token and role
// function verifyToken(req, res, next) {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];
//     if (!token) return res.sendStatus(401);
//     jwt.verify(token, SECRET_KEY, (err, user) => {
//         if (err) return res.sendStatus(403);
//         req.user = user;
//         next();
//     });
// }
//
// // Protected route to get areas
// app.get("http://localhost:8080/api/areas", verifyToken, (req, res) => {
//     // Check role
//     if (req.user.role !== "ADMIN") return res.sendStatus(403);
//     // Return areas data (from your Excel)
//     res.json([/* your area data here */]);
// });
//
// // Delete area
// app.delete("http://localhost:8080/api/areas/:id", verifyToken, (req, res) => {
//     if (req.user.role !== "ADMIN") return res.sendStatus(403);
//     const id = parseInt(req.params.id);
//     // Perform deletion logic here (from your data)
//     res.json({ message: "Deleted", id });
// });
//
// app.listen(8080, () => console.log("Server running on port 8080"));