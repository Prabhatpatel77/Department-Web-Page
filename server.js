const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const app = express();

const PORT = 3000;


// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "prabhat@123",
    database: "department_db"
});


// Connect MySQL
db.connect((err) => {

    if (err) {
        console.log("Database connection failed:", err);
        return;
    }

    console.log("MySQL connected successfully!");

});


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: "department-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60
        }
    })
);


// Serve frontend
app.use(express.static("public"));


// Home
app.get("/", (req, res) => {

    res.sendFile(__dirname + "/public/index.html");

});
app.post("/api/login", async (req, res) => {

    const { email, password } = req.body;


    // Check fields
    if (!email || !password) {

        return res.status(400).json({
            message: "Email and password are required"
        });

    }


    try {

        // Find user
        const [users] = await db.promise().query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );


        // User not found
        if (users.length === 0) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        const user = users[0];


        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );


        // Password incorrect
        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        // Login successful
       req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email
};

res.json({
    message: "Login successful"
});


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

// Start server
app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});