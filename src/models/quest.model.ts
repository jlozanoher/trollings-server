import { Trolling } from "./trolling.model";

export interface Quest extends QuestCommon {
  checkFunction: Function;
  rewardFunction: Function;
  createFunction: Function;
}

export interface QuestPublic extends QuestCommon {
  trollings: Trolling[];
}

export interface QuestCommon {
  id: number | string;
  name: string;
  description: string;
  state: "completed" | "uncompleted" | "failed";
  reward?: number | Function; // points
  time?: number; // milliseconds
}
