// peak joblessness
// - didnt make it tho (chatgpt eh)
// got to the point where my edits look like either chatgpt has my style or i have chatgpt's style
type MarkdownReaderProps = {
  markdown: string
  className?: string
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function parseTable(lines: string[], startIndex: number) {
  const rows: string[][] = []
  let i = startIndex
  while (i < lines.length && /\|/.test(lines[i])) {
    const row = lines[i]
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim())
    rows.push(row)
    i++
  }
  if (rows.length < 2) return { html: "", nextIndex: startIndex }
  const header = rows[0]
  const body = rows.slice(1)
  let html = `<table class="table-auto border-collapse border border-white/30 my-2">`
  html += "<thead><tr>"
  for (const h of header) html += `<th class="border border-white/30 px-2 py-1">${h}</th>`
  html += "</tr></thead><tbody>"
  for (const r of body) {
    html += "<tr>"
    for (const c of r) html += `<td class="border border-white/20 px-2 py-1">${c}</td>`
    html += "</tr>"
  }
  html += "</tbody></table>"
  return { html, nextIndex: i }
}

function parseMarkdownToHTML(md: string) {
  const lines = md.replace(/\r\n/g, "\n").split("\n")
  let out = ""
  let inCodeBlock = false
  let codeBuffer: string[] = []

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // Handle fenced code blocks ```
    if (line.trim().startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true
        codeBuffer = []
      } else {
        inCodeBlock = false
        out += `<pre class="bg-black/50 text-green-300 rounded p-2 my-2 overflow-x-auto"><code>${escapeHtml(
          codeBuffer.join("\n")
        )}</code></pre>`
      }
      continue
    }
    if (inCodeBlock) {
      codeBuffer.push(line)
      continue
    }

    // Blockquote
    if (line.trim().startsWith(">")) {
      out += `<blockquote class="border-l-4 border-white/40 pl-3 italic my-2">${inlineMarkdown(
        escapeHtml(line.replace(/^>\s?/, ""))
      )}</blockquote>`
      continue
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      let content = inlineMarkdown(escapeHtml(headingMatch[2].trim()))
      out += `<h${level} class="text-${Math.max(
        7 - level,
        1
      )}xl font-bold my-2">${content}</h${level}>`
      continue
    }

    // Lists
    if (/^(\s*[-*+]\s+)/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^(\s*[-*+]\s+)/.test(lines[i])) {
        items.push(lines[i].replace(/^(\s*[-*+]\s+)/, ""))
        i++
      }
      i--
      out += "<ul class='list-disc ml-6 my-2'>"
      for (const item of items) out += `<li>${inlineMarkdown(escapeHtml(item))}</li>`
      out += "</ul>"
      continue
    }
    if (/^(\s*\d+\.\s+)/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^(\s*\d+\.\s+)/.test(lines[i])) {
        items.push(lines[i].replace(/^(\s*\d+\.\s+)/, ""))
        i++
      }
      i--
      out += "<ol class='list-decimal ml-6 my-2'>"
      for (const item of items) out += `<li>${inlineMarkdown(escapeHtml(item))}</li>`
      out += "</ol>"
      continue
    }

    // Table
    if (/\|/.test(line)) {
      const nextLine = lines[i + 1] ?? ""
      if (/^\s*\|?[\s-:|]+\|?\s*$/.test(nextLine)) {
        const { html, nextIndex } = parseTable(lines, i)
        if (html) {
          out += html
          i = nextIndex - 1
          continue
        }
      }
    }

    // Images
    if (line.trim().startsWith("![")) {
      const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)(?:\s*"(.*?)")?$/)
      if (imgMatch) {
        const alt = escapeHtml(imgMatch[1])
        const src = escapeHtml(imgMatch[2])
        const title = imgMatch[3] ? ` title="${escapeHtml(imgMatch[3])}"` : ""
        out += `<p><img src="${src}" alt="${alt}"${title} class="max-w-full rounded my-2" /></p>`
        continue
      }
    }

    // Normal paragraph
    if (line.trim().length > 0) {
      out += `<p class="my-2">${inlineMarkdown(escapeHtml(line))}</p>`
    }
  }
  return out
}

function inlineMarkdown(text: string) {
  let t = text
  // inline code
  t = t.replace(/`([^`]+)`/g, (_, code) => `<code class="bg-black/30 px-1 rounded">${code}</code>`)
  // images inline
  t = t.replace(/!\[(.*?)\]\((.*?)\)/g, (_, alt, src) => {
    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" class="inline-block h-6" />`
  })
  // links
  t = t.replace(/\[(.*?)\]\((.*?)\)/g, (_, label, href) => {
    return `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer" class="text-blue-400 underline">${label}</a>`
  })
  // underline
  t = t.replace(/\+\+(.*?)\+\+/g, (_, u) => `<u>${u}</u>`)
  // bold
  t = t.replace(/\*\*(.*?)\*\*/g, (_, b) => `<strong class="font-bold">${b}</strong>`)
  t = t.replace(/__(.*?)__/g, (_, b) => `<strong class="font-bold">${b}</strong>`)
  // italic
  t = t.replace(/\*(.*?)\*/g, (_, i) => `<em class="italic">${i}</em>`)
  t = t.replace(/_(.*?)_/g, (_, i) => `<em class="italic">${i}</em>`)
  return t
}

export default function MarkdownReader({ markdown, className = "" }: MarkdownReaderProps) {
  const html = parseMarkdownToHTML(markdown)
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
