export const ERROR_EMPTY_TEMPLATE_MESSAGE = 'Template message cannot be empty';
export const ERROR_TOO_LONG_TEMPLATE_MESSAGE =
  'Template message must be 255 characters or fewer';
export const ERROR_MISSING_TEMPLATE_MESSAGE = 'templateMessage is required';
export const MAX_LENGTH = 255;

type insertableTemplateRecord = {
  templateMessage: string;
};

type UpdateableTemplateRecord = {
  id: number;
  templateMessage: string;
};

export const INSERTABLE_TEMPLATES: insertableTemplateRecord[] = [
  {
    templateMessage: 'You nailed it! 💪',
  },
  {
    templateMessage: 'You did it! I knew you could. 🤗',
  },
  {
    templateMessage: "Oh my gosh, that's excellent! 🤩",
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
