import { Title } from "./models";

export const getTitleByPoints = (points: number) => {
  for (let i = titles.length - 1; i >= 0; --i) {
    if (titles[i].points <= points) return titles[i];
  }
};

export const titles: Title[] = [
  {
    name: "Newbie",
    description: "You haven't achieved anything yet.",
    points: 0,
  },
  {
    name: "Beast apprentice",
    description: "You have completed at least one quest.",
    points: 50,
  },
  {
    name: "Beast master",
    description:
      "You have being in several battles and you're in the right path.",
    points: 100,
  },
  {
    name: "Overlord",
    description:
      "You command legions and have cleaned the lands of all kinds of creatures.",
    points: 200,
  },
];
