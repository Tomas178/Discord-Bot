type InsertableTemplateRecord = {
  templateMessage: string;
};

type UpdateableTemplateRecord = {
  id: number;
  templateMessage: string;
};

export const INSERTABLE_TEMPLATES: InsertableTemplateRecord[] = [
  {
    templateMessage:
      '{username} has just completed {sprintTitle}!\nYou nailed it! 💪',
  },
  {
    templateMessage:
      '{username} has just completed {sprintTitle}!\nYou did it! I knew you could. 🤗',
  },
  {
    templateMessage:
      "{username} has just completed {sprintTitle}!\nOh my gosh, that's excellent! 🤩",
  },
];

export const TEMPLATES_FOR_UPDATE: UpdateableTemplateRecord[] = [
  {
    id: 1,
    templateMessage:
      '{username} has just completed {sprintTitle}!\nYou did it! I knew you could. 🤗',
  },
  {
    id: 2,
    templateMessage:
      '{username} has just completed {sprintTitle}!\nApplause, applause, applause! 👏 Congrats on your hard-earned success!',
  },
  {
    id: 3,
    templateMessage:
      '{username} has just completed {sprintTitle}!\nWe believe in you! And unicorns...🦄 But mostly you.',
  },
];
