import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import { Trolling, TrollingType } from "./models";

const MAX_TROLLING = 3;

class Connection {
  io: Server;
  socket: Socket;

  trollings: Trolling[];

  constructor(io: Server, socket: Socket) {
    this.socket = socket;
    this.io = io;

    this.trollings = [];

    setInterval(() => {
      // io.emit("achievement", "first achievement");
      // console.log("first achievement");

      if (this.trollings.length < MAX_TROLLING) {
        const trolling = this.generateTrolling();
        io.emit("new-trolling", trolling);
        console.log("new-trolling", trolling);
      }
    }, 2000);

    socket.on("remove-trolling", (trollingId) =>
      this.removeTrolling(trollingId)
    );

    console.log("a user connected");
  }

  generateTrolling() {
    const rand = Math.random();
    let type: TrollingType;
    if (rand < 1 / 3) type = "orc";
    else if (rand < 2 / 3) type = "troll";
    else type = "princess";

    const trolling: Trolling = {
      id: nanoid(),
      type,
      position: { x: `${Math.random() * 90}%`, y: `${Math.random() * 100}%` },
      state: "alive",
    };
    this.trollings.push(trolling);
    return trolling;
  }

  removeTrolling(trollingId: number) {
    console.log("removeTrolling", trollingId);
    let aux;
    this.trollings = this.trollings.map((e) =>
      e.id !== trollingId ? e : ({ ...e, state: "dead" } as Trolling)
    );
    this.io.emit(
      "update-trolling",
      this.trollings.find((e) => e.id === trollingId)
    );
  }
}

function game(io: Server) {
  io.on("connection", (socket: Socket) => {
    new Connection(io, socket);
  });
}

export default game;
