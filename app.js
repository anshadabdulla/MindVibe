const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const routes = require("./routes/index");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set view engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Use routes
app.use("/", routes);

app.get("/", (req, res) => {
  res.render("home"); // Render home.hbs
});

app.get("/about", (req, res) => {
  res.render("about"); // Render about.hbs
});

app.get('/courses', (req, res) => {
  res.render('courses'); // Render service.hbs
});

app.get('/contact', (req, res) => {
  res.render('contact'); // Render contact.hbs
});

app.get('/home', (req, res) => {
  res.render('home'); // Render home.hbs
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
