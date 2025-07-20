type insertableTemplateRecord = {
  templateMessage: string;
};

type UpdateableTemplateRecord = {
  id: number;
  templateMessage: string;
};

export const INSERTABLE_TEMPLATES: insertableTemplateRecord[] = [
  {
    templateMessage: '{username} You nailed it! 💪',
  },
  {
    templateMessage: '{sprintTitle} You did it! I knew you could. 🤗',
  },
  {
    templateMessage:
      "Oh my gosh, {username} completed {sprintTitle} that's excellent! 🤩",
  },
];

export const TEMPLATES_FOR_UPDATE: UpdateableTemplateRecord[] = [
  {
    id: 1,
    templateMessage: 'You did it! I knew you could. 🤗',
  },
  {
    id: 2,
    templateMessage:
      'Applause, applause, applause! 👏 Congrats on your hard-earned success!',
  },
  {
    id: 3,
    templateMessage: 'We believe in you! And unicorns...🦄 But mostly you.',
  },
];
