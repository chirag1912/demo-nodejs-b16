const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoDB = require("mongodb");
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
  res.send("Sample page from server <br> " + process.env.CONFIG_VALUE);
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

// app.get("/users", (req, res) => {
//   mongoClient.connect(dbUrl, (err, client) => {
//     if (err) throw err;
//     let db = client.db("studentDetails");
//     db.collection("users")
//       .find()
//       .toArray()
//       .then((data) => {
//         res.status(200).json(data);
//       });
//   });
// });

// DB_URL =mongodb+srv://venkat_r:KZEQqmx98Lck1NMq@cluster-storage.e9lw1.mongodb.net/student_db?retryWrites=true&w=majority
