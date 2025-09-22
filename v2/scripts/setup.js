const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const srcRoot = path.join(projectRoot, 'src');

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function read(file) { return fs.readFileSync(file, 'utf8'); }
function write(file, content) { ensureDirSync(path.dirname(file)); fs.writeFileSync(file, content, 'utf8'); }

function listPhpPages(dir) {
  return fs.readdirSync(dir)
    .filter(n => n.endsWith('.php') && n !== 'header.php' && n !== 'footer.php')
    .map(n => path.join(dir, n));
}

function stripPhpIncludes(content) {
  return content
    .split(/\r?\n/)
    .filter(line => !/include\(['\"]header\.php['\"]\)\s*;?/.test(line) && !/include\(['\"]footer\.php['\"]\)\s*;?/.test(line))
    .join('\n');
}

function stripContentWrapper(html) {
  // Remove a single top-level <div id="content"> ... </div> wrapper if present
  const startIdx = html.indexOf('<div id="content"');
  if (startIdx === -1) return html.trim();
  // Find the matching closing </div> for the first wrapper by simple heuristic: last occurrence before EOF
  // Safer: remove the first opening tag and the last closing tag if file structure matches our pages
  const afterOpen = html.slice(startIdx);
  const lastCloseIdx = html.lastIndexOf('</div>');
  if (lastCloseIdx === -1) return html.trim();
  const inner = html.slice(startIdx, lastCloseIdx + 6);
  // Remove the first opening <div id="content"...> and the last </div>
  const firstTagEnd = inner.indexOf('>');
  if (firstTagEnd === -1) return html.trim();
  const withoutOuter = inner.slice(firstTagEnd + 1, inner.length - 6);
  return withoutOuter.trim();
}

function rewritePhpLinksToHtml(html) {
  return html.replace(/(href|src)=(['"])((?!https?:|mailto:|tel:|#)[^'"\s>]+?)\.php(#[^'"\s>]*)?\2/gi,
    (m, attr, quote, p, hash) => `${attr}=${quote}${p}.html${hash || ''}${quote}`
  );
}

function phpToNunjucks() {
  const root = path.join(projectRoot, '..');
  const pages = listPhpPages(root);
  ensureDirSync(srcRoot);
  pages.forEach(p => {
    const base = path.basename(p, '.php');
    const out = path.join(srcRoot, `${base}.njk`);
    const raw = read(p);
    const noIncludes = stripPhpIncludes(raw);
    const body = stripContentWrapper(noIncludes);
    const rewritten = rewritePhpLinksToHtml(body);
    const permalink = base === 'index' ? 'index.html' : '{{ page.fileSlug }}.html';
    const frontMatter = `---\nlayout: base.njk\npermalink: "${permalink}"\n---\n`;
    write(out, frontMatter + '\n' + rewritten + '\n');
    console.log(`Created src/${base}.njk`);
  });
}

function main() {
  ensureDirSync(srcRoot);
  phpToNunjucks();
}

main();


