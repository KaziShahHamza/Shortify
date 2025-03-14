import express from "express";

const app = express();

app.get("/test", (req, res) => {
  return res.json("test ok");
});

app.get("/create-story", (req, res) => {
    const url = req.query.url;
    console.log({url});
    
    return res.json("query running");
  });
  

app.listen(8080, () => console.log("Listening on port 8080"));
