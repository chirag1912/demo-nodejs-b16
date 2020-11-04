const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoDB = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { authorize, allowUser } = require("./custom-middleware/auth");
const mongoClient = mongoDB.MongoClient;
const objId = mongoDB.ObjectID;

const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`your app is running with ${port}`));

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017";

app.get("/", (req, res) => {
  res.send("Sample page from server <br> ");
});

app.get("/users", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbUrl);
    let db = client.db("studentDetails");
    let data = await db.collection("users").find().toArray();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
});

app.post("/register", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbUrl);
    let db = client.db("studentDetails");
    let data = await db.collection("users").findOne({ email: req.body.email });
    if (data) {
      res.status(400).json({ message: "user already exists" });
    } else {
      let salt = await bcrypt.genSalt(12);
      let hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
      let result = await db.collection("users").insertOne(req.body);
      res.status(200).json({ message: "Registered successfully" });
      client.close();
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbUrl);
    let db = client.db("studentDetails");
    let data = await db.collection("users").findOne({ email: req.body.email });
    if (data) {
      let isValid = await bcrypt.compare(req.body.password, data.password);
      if (isValid) {
        let token = await jwt.sign(
          { userId: data._id, role: data.role },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );
        console.log("valid user", isValid);
        console.log("token", token);
        res.status(200).json({
          status: 200,
          message: "login success",
          token,
        });
      } else {
        res.status(403).json({
          message: "invalid password",
        });
      }
    } else {
      res.status(401).json({
        status: 401,
        message: "Email is not registered",
      });
    }
    client.close();
  } catch (error) {
    console.log(error);
  }
});

app.get("/dashboard", [authorize, allowUser("ADMIN")], (req, res) => {
  res.json({
    message: "valid token and you can access dashboard",
  });
});

app.get("/student-profile", [authorize, allowUser("STUDENT")], (req, res) => {
  res.json({
    message: "valid token and you can access student profile",
  });
});
