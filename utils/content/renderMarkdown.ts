import prism from "markdown-it-prism";
// @ts-ignore
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";

export const renderMarkdown = (markdown: string) => {
    const md = markdownIt({
        linkify: true,
        typographer: true,
    })
    md.use(prism, {
        highlightInlineCode: true,
    })

    md.use(markdownItAnchor)

    const renderedArticle = md.render(markdown)

    return renderedArticle 
}