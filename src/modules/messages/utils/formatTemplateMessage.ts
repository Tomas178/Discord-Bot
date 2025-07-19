export function formatTemplateMessage(
  template: string,
  replacements: {
    username?: string;
    sprintTitle?: string;
  }
): string {
  let message = template;

  if (template.includes('{username}') && replacements.username) {
    message = message.replace('{username}', replacements.username);
  }

  if (template.includes('{sprintTitle}') && replacements.sprintTitle) {
    message = message.replace('{sprintTitle}', replacements.sprintTitle);
  }

  return message;
}
