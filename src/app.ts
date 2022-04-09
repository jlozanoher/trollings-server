import config from "config";
import cors from "cors";
import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import game from "./game";

const port = config.get("port") as number;
const host = config.get("host") as string;

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

game(io);

app.get("/", (req, res) => {
  res.send("<h1>Trolling server is up</h1>");
});

server.listen(port, host, () => {
  console.log(`Server listing at http://${host}:${port}`);
});
