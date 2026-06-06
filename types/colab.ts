export type AreaKey = "9" | "10" | "11" | "12" | "TYT" | "AYT";

export type ThreeDModel = {
  title: string;
  purpose: string;
  provider: "Sketchfab" | "planned";
  embed?: string;
};

export type Topic = {
  id: string;
  title: string;
  area: string;
  tags: string[];
  summary: string;
  mapUrl: string;
  models: ThreeDModel[];
};

export type Question = {
  id: string;
  area: string;
  classes: string[];
  topic: string;
  difficulty: string;
  questionType: string;
  stem: string;
  options: string[];
  answer: string;
  visitorShowAnswer: boolean;
  approvalStatus: "draft" | "approved" | "rejected";
};
