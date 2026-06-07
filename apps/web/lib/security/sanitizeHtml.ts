import sanitizeHtmlLib from 'sanitize-html';

const SANITIZE_OPTIONS: sanitizeHtmlLib.IOptions = {
  allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'blockquote'],
  allowedAttributes: {},
};

export function sanitizeHtml(html: string): string {
  return sanitizeHtmlLib(html, SANITIZE_OPTIONS);
}

export function markdownToSafeHtml(markdown: string): string {
  const summaryHtml = markdown
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
  return sanitizeHtml(`<p>${summaryHtml}</p>`);
}
