import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import { Trolling, TrollingType, Quest, QuestPublic, Player } from "./models";
import { quests } from "./quests";
import { getTitleByPoints, titles } from "./titles";

const MAX_TROLLING = 3;

class Connection {
  io: Server;
  socket: Socket;

  running: boolean;
  trollings: Trolling[];
  currentQuest?: Quest;
  lastCompletedQuestIndex?: number;
  player?: Player;

  constructor(io: Server, socket: Socket) {
    this.socket = socket;
    this.io = io;

    this.trollings = [];
    this.running = false;

    this.newGame();

    setInterval(() => {
      if (this.running && !this.currentQuest) {
        let questIndex =
          this.lastCompletedQuestIndex === undefined
            ? 0
            : this.lastCompletedQuestIndex + 1;

        // There are no more quests
        if (questIndex >= quests.length) {
          io.emit("game-over");
          this.running = false;
          return;
        }

        this.currentQuest = quests[questIndex];

        const { checkFunction, createFunction, rewardFunction, ...rest } =
          this.currentQuest;

        const publicQuest: QuestPublic = {
          ...rest,
          trollings: createFunction((type: TrollingType) =>
            this.generateTrolling(type)
          ),
        };

        this.trollings = publicQuest.trollings;

        io.emit("new-quest", publicQuest);

        console.log("new-quest", publicQuest);
      }
    }, 1000);

    socket.on("remove-trolling", (trollingId) => {
      this.removeTrolling(trollingId);
    });

    socket.on("new-game", () => {
      this.newGame();
    });

    console.log("a user connected");
  }

  generateTrolling(type?: TrollingType) {
    if (!type) {
      const rand = Math.random();
      if (rand < 1 / 3) type = "orc";
      else if (rand < 2 / 3) type = "troll";
      else type = "princess";
    }

    const trolling: Trolling = {
      id: nanoid(),
      type,
      position: { x: `${Math.random() * 90}%`, y: `${Math.random() * 70}%` },
      state: "alive",
    };
    return trolling;
  }

  removeTrolling(trollingId: number) {
    if (this.currentQuest?.state !== "uncompleted") return;

    console.log("removeTrolling", trollingId);
    let aux;
    this.trollings = this.trollings.map((e) =>
      e.id !== trollingId ? e : ({ ...e, state: "dead" } as Trolling)
    );

    this.io.emit(
      "update-trolling",
      this.trollings.find((e) => e.id === trollingId)
    );

    this.checkQuest();
  }

  checkQuest() {
    const state =
      this.currentQuest && this.currentQuest?.checkFunction(this.trollings);

    console.log("state", state);
    if (state !== "uncompleted") {
      console.log("QUEST COMPLETED: ", this.currentQuest?.name);

      // @ts-ignore
      this.currentQuest?.state = state;
      this.lastCompletedQuestIndex =
        this.lastCompletedQuestIndex === undefined
          ? 0
          : this.lastCompletedQuestIndex + 1;

      this.io.emit("update-quest", this.currentQuest);

      if (state === "completed" && this.player) {
        this.player.points += this.currentQuest?.rewardFunction();
        this.player.title = getTitleByPoints(this.player.points);
        this.io.emit("update-player", this.player);
      }

      setTimeout(() => {
        this.currentQuest = undefined;
      }, 3000);
    }
  }

  newGame() {
    quests.forEach((e) => (e.state = "uncompleted"));
    this.trollings = [];
    this.currentQuest = undefined;
    this.lastCompletedQuestIndex = undefined;
    this.running = true;
    this.player = { points: 0, title: titles[0] };
    this.io.emit("update-player", this.player);
  }
}

function game(io: Server) {
  io.on("connection", (socket: Socket) => {
    new Connection(io, socket);
  });
}

export default game;
