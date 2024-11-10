import express from "express";
import axios from "axios";
import http from "http";
import { Server } from "socket.io";
import { promises as fs } from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});
const port = process.env.PORT || 3000;
const checkInterval = process.env.CHECK_EVERY_SECOND || 10000;

async function loadConfig() {
  const configData = await fs.readFile("./config.json", "utf-8");
  return JSON.parse(configData);
}

async function pingNode(domain, port, protocol = "http", retries = 2, timeout = 5000) {
  const url = `${protocol}://${domain}:${port}`;
  try {
    const response = await axios.get(url, { timeout, validateStatus: false });
    if (response.status >= 200 && response.status < 300) {
      return { status: "up", details: "Site is operational" };
    } else {
      return { status: "down", details: `Error: ${response.status} ${response.statusText}` };
    }
  } catch (error) {
    if (retries > 0) return pingNode(domain, port, protocol, retries - 1, timeout);
    return { status: "down", details: error.message || "Unknown error" };
  }
}

async function checkSiteStatus(config) {
  const statuses = await Promise.all(
    config.Sites.map(async (site) => {
      const { status, details } = await pingNode(site.domain, site.port);
      return { name: site.name, status, details };
    })
  );

  const incidents = statuses.filter(site => site.status === "down");
  io.emit("statusUpdate", statuses);
  io.emit("incidentUpdate", incidents);
}

app.use(express.static("public"));

let config = { Sites: [] };

async function initServer() {
  config = await loadConfig();
  checkSiteStatus(config);
  setInterval(() => checkSiteStatus(config), checkInterval);
  server.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

io.on("connection", () => checkSiteStatus(config));

initServer();
