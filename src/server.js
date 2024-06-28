import express from "express";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: true }));

let text = "";

app.get("/data", (req, res) => {
  res.send(text);
});

app.post("/data", (req, res) => {
  const { text: newText } = req.body;
  text = newText;
  setTimeout(() => {
    res.send({ status: true });
  }, 2000);
});

app.listen(7000, () => {
  console.log("Server is listening");
});
