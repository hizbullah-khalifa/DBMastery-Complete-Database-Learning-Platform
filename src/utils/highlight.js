const SQL_KEYWORDS = [
  'select','from','where','insert','into','values','update','set','delete','create','database',
  'table','alter','drop','truncate','primary','key','foreign','references','unique','not','null',
  'check','default','join','inner','left','right','full','outer','cross','on','as','order','by',
  'group','having','limit','offset','distinct','and','or','in','between','like','is','exists',
  'union','all','case','when','then','else','end','with','view','index','procedure','trigger',
  'begin','commit','rollback','transaction','use','show','describe','explain','asc','desc',
  'add','column','constraint','cascade','rename','to','if','partition','over','returning',
  'auto_increment','int','bigint','varchar','char','text','date','datetime','timestamp','boolean',
  'decimal','float','json','modify','engine','character',
]

const JS_KEYWORDS = [
  'const','let','var','function','return','if','else','for','while','new','await','async','of',
  'in','typeof','null','true','false','undefined','import','from','export','default','try','catch',
]

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Lightweight regex tokenizer producing highlighted HTML for sql / js / env / text.
 * Returns an array of { cls, text } tokens.
 */
export function tokenize(src, lang = 'sql') {
  const kws =
    lang === 'sql' ? SQL_KEYWORDS : lang === 'js' || lang === 'env' ? JS_KEYWORDS : []
  const re =
      /(--[^\n]*|\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*")|(\$[A-Za-z]\w*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][\w$]*)|([{}()[\];,.=<>+\-*/%!|]+)/g
  const out = []
  let last = 0
  let m
  while ((m = re.exec(src)) !== null) {
    if (m.index > last) out.push({ cls: '', text: src.slice(last, m.index) })
    const [full, com, str, op, num, word, punc] = m
    if (com) out.push({ cls: 'tok-com', text: full })
    else if (str) out.push({ cls: 'tok-str', text: full })
    else if (op) out.push({ cls: 'tok-op', text: full })
    else if (num) out.push({ cls: 'tok-num', text: full })
    else if (word) {
      const lower = word.toLowerCase()
      if (kws.includes(lower)) out.push({ cls: 'tok-kw', text: full })
      else if (/^[A-Z]/.test(word)) out.push({ cls: 'tok-fn', text: full })
      else if (new RegExp(esc(word) + '\\s*\\(').test(src.slice(m.index))) out.push({ cls: 'tok-fn', text: full })
      else out.push({ cls: '', text: full })
    } else if (punc) out.push({ cls: 'tok-punc', text: full })
    last = m.index + full.length
  }
  if (last < src.length) out.push({ cls: '', text: src.slice(last) })
  return out
}

export function highlightToHtml(src, lang) {
  return tokenize(src, lang)
    .map((t) => (t.cls ? `<span class="${t.cls}">${esc(t.text)}</span>` : esc(t.text)))
    .join('')
}
