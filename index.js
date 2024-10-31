import express from "express";

import generateResults from "./generateResults.js";

const app = express();

const PORT = 3000;

app.get("/flights", async (req, res) => {
  const { carrier } = req.query;
  const options = await generateResults({ carrier });
  res.send({ options });
});

app.listen(PORT, () => {
  console.log("Listening on the port: ", PORT);
});
