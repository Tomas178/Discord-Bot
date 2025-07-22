import { formatTemplateMessage } from './formatTemplateMessage';

describe('formatTemplateMessage', () => {
  it('replaces both placeholders', () => {
    const result = formatTemplateMessage(
      'Hello {username}, welcome to {sprintTitle}!',
      { username: 'Tomas', sprintTitle: 'Python programming' }
    );
    expect(result).toBe('Hello Tomas, welcome to Python programming!');
  });
});
