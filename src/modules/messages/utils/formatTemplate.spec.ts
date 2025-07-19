import { formatTemplateMessage } from './formatTemplateMessage';

describe('formatTemplateMessage', () => {
  it('replaces both placeholders', () => {
    const result = formatTemplateMessage(
      'Hello {username}, welcome to {sprintTitle}!',
      { username: 'Alice', sprintTitle: 'Sprint 3' }
    );
    expect(result).toBe('Hello Alice, welcome to Sprint 3!');
  });

  it('replaces only username if sprintTitle is missing', () => {
    const result = formatTemplateMessage('Hi {username}!', {
      username: 'Bob',
    });
    expect(result).toBe('Hi Bob!');
  });

  it('replaces only sprintTitle if username is missing', () => {
    const result = formatTemplateMessage(
      'Congrats on completing {sprintTitle}!',
      {
        sprintTitle: 'Python programming',
      }
    );
    expect(result).toBe('Congrats on completing Python programming!');
  });

  it('returns original if no placeholders', () => {
    const result = formatTemplateMessage('Static message', {
      username: 'Bob',
    });
    expect(result).toBe('Static message');
  });
});
