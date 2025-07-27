export type PostRequest = {
  username: string;
  sprintCode: string;
  templateId?: number;
};

export type GetRequest = {
  username?: string;
  sprint?: string;
};
