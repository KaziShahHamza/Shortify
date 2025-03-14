import express from "express";
import uniqid from "uniqid";
import fs from "fs";
import cors from "cors";
import { GPTScript, RunEventType } from "@gptscript-ai/gptscript";

const g = new GPTScript({key: process.env.GPTSCRIPT_API_KEY});

const app = express();
app.use(cors());

app.get("/test", (req, res) => {
  return res.json("test ok");
});

app.get("/create-story", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: "url is required" });
  }

  const dir = uniqid();
  const path = "./stories/" + dir;

  try {
    fs.mkdirSync(path, { recursive: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "error creating directory" });
  }

  console.log({ url });

  const opts = {
    input: `--url ${url} --dir ${path}`,
    disableCache: true,
  };


  try {
    const run = await g.run("./story.gpt", opts);


    run.on(RunEventType.Event, (event) => {
      if (event.type === RunEventType.CallFinish && event.output) {
        console.log(event.output);
      }
    });

    console.log("after event");

    const result = await run.text();

    console.log("after result");
    console.log(result);

    return res.json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "error occurred" });
  }
});

app.listen(8080, () => console.log("Listening on port 8080"));
