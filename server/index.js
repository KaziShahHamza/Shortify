import express from "express";
import uniqid from "uniqid";
import fs from "fs";
import cors from "cors";
import { GPTScript, RunEventType } from "@gptscript-ai/gptscript";
import dotenv from "dotenv";

const app = express();
app.use(cors());
dotenv.config();

// console.log("API Key: ", process.env.OPENAI_API_KEY);
const g = new GPTScript(); 
if (g) console.log(g);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ---------------------------------------------

app.get("/newPath", (req, res) => {
  const url = req.query.url;
  console.log("Received request with URL:", url);

  if (!url) {
    console.error("URL is missing in the request");
    return res.status(400).json({ error: "url is required" });
  }

  const dir = uniqid();
  const path = "./storiesTwo/" + dir;
  console.log("Directory path: ", path);

  try {
    fs.mkdirSync(path, { recursive: true });
    console.log("Directory created successfully");
  } catch (e) {
    console.error("Error creating directory: ", e);
    return res.status(500).json({ error: "error creating directory" });
  }

  const opts = {
    input: `--url ${url} --dir ${path}`,
    disableCache: true,
  };
  console.log("Running GPTScript with options:", opts);

  return res.status(200).json("success");
});

// ---------------------------------------------

app.get("/write", async (req, res) => {
  try {
    const run = await g.run("./storyTwo.gpt");

    if (!run) {
      console.error("Failed to execute GPTScript");
      return res.status(500).json({ error: "error running GPTScript" });
    }

    const result = await run.text();

    if (!result) {
      console.error("No result returned from GPTScript");
      return res.status(500).json({ error: "no result" });
    }
    console.log("GPTScript result:", result);

    return res.json(result);
  } catch (e) {
    console.error("Error occurred during GPTScript execution:", e);
    return res.status(500).json({ error: "error occurred" });
  }
});
// ---------------------------------------------

app.get("/create-story", async (req, res) => {
  const url = req.query.url;
  console.log("Received request with URL:", url);

  if (!url) {
    console.error("URL is missing in the request");
    return res.status(400).json({ error: "url is required" });
  }

  const dir = uniqid();
  const path = "./stories/" + dir;
  console.log("Generated directory path:", path);

  try {
    fs.mkdirSync(path, { recursive: true });
    console.log("Directory created successfully");
  } catch (e) {
    console.error("Error creating directory:", e);
    return res.status(500).json({ error: "error creating directory" });
  }

  const opts = {
    input: `--url ${url} --dir ${path}`,
    disableCache: true,
  };

  try {
    console.log("Going to run GPTScript");
    const run = await g.run("./story.gpt", opts);

    if (!run) {
      console.error("Failed to run GPTScript");
      return res.status(500).json({ error: "error running GPTScript" });
    }

    run.on(RunEventType.Event, (ev) => {
      if (ev.type === RunEventType.CallFinish && ev.output) {
        console.log(ev.output);
      }
    });

    console.log("waiting for result");
    const result = await run.text();

    if (!result) {
      console.error("No result returned from GPTScript");
      return res.status(500).json({ error: "no result" });
    }
    console.log("GPTScript result:", result);

    return res.json(result);
  } catch (e) {
    console.error("Error occurred during GPTScript execution:", e);
    return res.status(500).json({ error: "error occurred" });
  }
});

app.listen(8080, () => console.log("Listening on port 8080"));
