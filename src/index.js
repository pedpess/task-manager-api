const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/users", (request, response) => {
  console.log(request.body);
  response.send("sending post");
});

app.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});
