// @ts-ignore
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import hljs from "highlight.js";

// TODO: style for highlighting
// TODO: line numbers harus tidak boleh di highlight oleh cursor
// TODO: code line highlihgt

export const renderMarkdown = (markdown: string) => {
    console.log(markdown)
    const md = markdownIt({
        linkify: true,
        typographer: true,
        highlight: (str: string, lang: string, attrRaw: string = "") => {
            const attrs = attrRaw.split(/\s+/g);
            const showLineNumbers = attrs.includes("showLineNumbers");

            let code =
                lang && hljs.getLanguage(lang)
                    ? hljs.highlight(str, {
                          language: lang,
                          ignoreIllegals: true,
                      }).value
                    : md.utils.escapeHtml(str);

            if (showLineNumbers) {
                code = applyLineNumbers(code);
            }

            return `<pre class="hljs"><code>${code}</code></pre>`;
        },
    });

    md.use(markdownItAnchor);

    const renderedArticle = md.render(markdown);

    return renderedArticle;
};

const applyLineNumbers = (code: string) => {
    const lines = code.trim().split("\n");

    const rows = lines.map((line, idx) => {
        const lineNumber = idx + 1;

        let html = "<tr>";
        html += `<td class="line-number">${lineNumber}</td>`;
        html += `<td class="code-line">${line}</td>`;
        html += "</tr>";
        return html;
    });

    return `<table><tbody>${rows.join("")}</tbody></table>`;
};
