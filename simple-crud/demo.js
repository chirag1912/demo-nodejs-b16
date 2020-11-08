const express = require("express");

const app = express();

app.use(express.json());
const port = 3000;
let users = [];

app.listen(port, () => console.log("your app is running with port", port));

app.get("/", (req, res) => {
  res.status(200).json({
    msg: "All user data",
    users,
  });
});

app.post("/add-user", (req, res) => {
  users.push(req.body);
  res.status(200).json({
    msg: "User added",
    users,
  });
});

app.put("/update-user/:id", (req, res) => {
  if (req.params.id) {
    res.status(200).json({
      msg: "user updated",
    });
  }
});

app.delete("/delete-user/:id", (req, res) => {
  if (req.params.id) {
    res.status(200).json({
      msg: "user deleted ",
    });
  }
});
