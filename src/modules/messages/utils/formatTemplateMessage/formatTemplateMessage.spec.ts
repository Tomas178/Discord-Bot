import { formatTemplateMessage } from './formatTemplateMessage';

describe('formatTemplateMessage', () => {
  it('replaces both placeholders', () => {
    const result = formatTemplateMessage(
      'Hello {username}, welcome to {sprintTitle}!',
      { username: 'Alice', sprintTitle: 'Sprint 3' }
    );
    expect(result).toBe('Hello Alice, welcome to Sprint 3!');
  });
});
