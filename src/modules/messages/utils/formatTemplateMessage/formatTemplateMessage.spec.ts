import { formatTemplateMessage } from './formatTemplateMessage';

describe('formatTemplateMessage', () => {
  it('replaces both placeholders', () => {
    const result = formatTemplateMessage(
      'Hello {username}, welcome to {sprintTitle}!',
      { username: 'Tomas', sprintTitle: 'Python programming' }
    );
    expect(result).toBe('Hello Tomas, welcome to Python programming!');
  });

  it('Replaces all the placeholders', () => {
    const result = formatTemplateMessage(
      '{username} has just completed {sprintTitle}!\nVery well done!. {username}',
      { username: 'Tomas', sprintTitle: 'HTML' }
    );

    expect(result).toBe(
      'Tomas has just completed HTML!\nVery well done!. Tomas'
    );
  });
});
