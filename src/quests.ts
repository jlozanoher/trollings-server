import { Trolling } from "./models";
import { Quest } from "./models/quest.model";

export const quests: Quest[] = [
  {
    id: 1,
    name: "Orcs cleanning",
    description: "Eliminate all orcs from the land",
    reward: 50,
    state: "uncompleted",
    checkFunction: (trollings: Trolling[]) =>
      trollings.filter((e) => e.type === "orc" && e.state === "alive")
        .length === 0
        ? "completed"
        : "uncompleted",
    createFunction: (generateTrolling: Function) => {
      return [
        ...new Array(3).fill(0).map((e) => generateTrolling("orc")),
        ...new Array(3).fill(0).map((e) => generateTrolling()),
      ];
    },
    rewardFunction: () => 50,
  },
  {
    id: 2,
    name: "Don't like trolls",
    description: "Eliminate all the trolls from the land",
    reward: 50,
    state: "uncompleted",
    checkFunction: (trollings: Trolling[]) =>
      trollings.filter((e) => e.type === "troll" && e.state === "alive")
        .length === 0
        ? "completed"
        : "uncompleted",
    createFunction: (generateTrolling: Function) => {
      return [
        ...new Array(3).fill(0).map((e) => generateTrolling("troll")),
        ...new Array(3).fill(0).map((e) => generateTrolling()),
      ];
    },
    rewardFunction: () => 50,
  },
  {
    id: 3,
    name: "Princess saving",
    description: "Save the princess by eliminating all threats",
    reward: 100,
    state: "uncompleted",
    checkFunction: (trollings: Trolling[]) => {
      if (
        trollings.filter((e) => e.type === "princess" && e.state === "dead")
          .length
      )
        return "failed";
      if (
        trollings.filter(
          (e) => (e.type === "troll" || e.type === "orc") && e.state === "alive"
        ).length === 0
      )
        return "completed";
      return "uncompleted";
    },
    createFunction: (generateTrolling: Function) => {
      return [
        generateTrolling("princess"),
        ...new Array(4).fill(0).map((e) => generateTrolling("orc")),
        ...new Array(4).fill(0).map((e) => generateTrolling("troll")),
      ];
    },
    rewardFunction: () => 100,
  },
];
