const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  axios.post("http://posts-clusterip-srv:4000/events", event);
  axios.post("http://comments-srv:4001/events", event);

  axios.post("http://moderation-srv:4003/events", event);

  try {
    axios.post("http://query-srv:4002/events", event);
  } catch (err) {}

  res.send({ status: "ok" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Event bus is running on port 4005");
});

process.on("uncaughtException", function (err) {
  console.log(err);
});
