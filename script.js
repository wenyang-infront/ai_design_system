const sources = {
  primitives: 'tokens/Color Primitives/Color Primitives.json',
  semantic: 'tokens/Color Semantic/Color Semantic.json',
  typography: 'tokens/Typography/Default.json',
  spacing: 'tokens/Spacing/Default.json',
  radius: 'tokens/Radius/Default.json'
};

const getValue = token => token && token.$value;
const flatten = (object, prefix = '') => Object.entries(object).flatMap(([key, value]) => {
  const name = prefix ? `${prefix}.${key}` : key;
  return value && typeof value === 'object' && '$value' in value ? [[name, value]] : flatten(value, name);
});

function renderColors(primitives, semantic) {
  const primitivePalettes = Object.entries(primitives).map(([name, values]) => {
    const swatches = Object.entries(values).filter(([, token]) => token.$value);
    return `<div class="palette"><p class="palette-title">${name}</p><div class="swatches">${swatches.map(([step, token]) => `<div class="swatch"><div class="swatch-color" style="background:${token.$value}" title="Copy ${token.$value}" data-copy="${token.$value}"></div><span class="swatch-label">${step}</span><span class="swatch-hex">${token.$value}</span></div>`).join('')}</div></div>`;
  }).join('');
  const semanticColors = flatten(semantic).map(([name, token]) => {
    const reference = getValue(token);
    const match = reference.match(/^\{(.+)\}$/);
    const source = match ? flatten(primitives).find(([key]) => key === match[1])?.[1].$value || 'transparent' : reference;
    return `<span class="semantic-chip"><i style="background:${source}"></i>${name}</span>`;
  }).join('');
  return `${primitivePalettes}<div><p class="palette-title">Semantic roles</p><div class="semantic-group">${semanticColors}</div></div>`;
}

function renderTypography(tokens) {
  return Object.entries(tokens).map(([name, token]) => `<div class="type-row"><span class="type-name">${name}</span><p class="type-sample" style="font-family:${token.fontFamily.$value}, sans-serif;font-size:${token.fontSize.$value}px;line-height:${token.lineHeight.$value}px;font-weight:${token.fontWeight.$value};letter-spacing:${token.letterSpacing.$value}px">The quick brown fox</p><span class="meta">${token.fontSize.$value}px / ${token.lineHeight.$value}px<br />${token.fontWeight.$value} weight</span></div>`).join('');
}

function renderScale(tokens) {
  const entries = Object.entries(tokens.space);
  return entries.map(([name, token]) => `<div class="scale-row"><span class="scale-label">space ${name}</span><div class="scale-bar" style="width:${Math.max(token.$value, 4)}px"></div><span class="scale-value">${token.$value}px</span></div>`).join('');
}

function renderRadius(tokens) {
  return Object.entries(tokens.radius).map(([name, token]) => `<div class="radius-item"><div class="radius-box" style="border-radius:${token.$value}px"></div><span class="radius-label">${name}</span><span class="radius-value">${token.$value === 9999 ? 'full' : `${token.$value}px`}</span></div>`).join('');
}

async function init() {
  try {
    const data = Object.fromEntries(await Promise.all(Object.entries(sources).map(async ([name, path]) => [name, await fetch(path).then(response => response.json())])));
    document.querySelector('#color-content').innerHTML = renderColors(data.primitives, data.semantic);
    document.querySelector('#type-content').innerHTML = renderTypography(data.typography);
    document.querySelector('#spacing-content').innerHTML = renderScale(data.spacing);
    document.querySelector('#radius-content').innerHTML = renderRadius(data.radius);
    document.querySelectorAll('[data-copy]').forEach(element => element.addEventListener('click', async () => {
      await navigator.clipboard.writeText(element.dataset.copy);
      element.title = 'Copied';
      setTimeout(() => { element.title = `Copy ${element.dataset.copy}`; }, 1200);
    }));
  } catch (error) {
    document.querySelectorAll('.loading').forEach(element => { element.textContent = 'Could not load token files. Open this page through a local server.'; });
    console.error(error);
  }
}

init();