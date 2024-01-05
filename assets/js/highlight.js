import hljs from 'highlight.js/lib/core';

import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import http from 'highlight.js/lib/languages/http';
import bash from 'highlight.js/lib/languages/bash';
import python from 'highlight.js/lib/languages/python';
import protobuf from 'highlight.js/lib/languages/protobuf';
import java from 'highlight.js/lib/languages/java';
import terraform from './terraform';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('http', http);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('python', python);
hljs.registerLanguage('protobuf', protobuf);
hljs.registerLanguage('java', java);
hljs.registerLanguage('hcl', terraform);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('pre code:not(.language-mermaid)').forEach((block) => {
    hljs.highlightElement(block);
  });
});
