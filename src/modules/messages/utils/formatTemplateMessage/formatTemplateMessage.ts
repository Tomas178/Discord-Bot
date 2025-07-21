export function formatTemplateMessage(
  template: string,
  replacements: {
    username: string;
    sprintTitle: string;
  }
): string {
  let message = template;

  message = message.replace('{username}', replacements.username);
  message = message.replace('{sprintTitle}', replacements.sprintTitle);

  return message;
}
