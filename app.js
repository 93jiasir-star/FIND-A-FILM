const platforms = [
  { group: '影札记', note: '影迷评价与评分', icon: '豆', name: '豆瓣电影', meta: '评分、短评与影评', url: q => `https://search.douban.com/movie/subject_search?search_text=${q}` },
  { group: '影札记', note: '影迷评价与评分', icon: 'I', name: 'IMDb（需要外网）', meta: '全球影视资料与评分', url: q => `https://www.imdb.com/find/?q=${q}` },
  { group: '浮光间', note: '在线观影', icon: 'L', name: 'Libvio', meta: '在线观影与下载', url: q => `https://libviobd.com/search/-------------.html?wd=${q}` },
  { group: '浮光间', note: '在线观影', icon: 'P', name: 'PKAVI', meta: '在线观影与下载', url: q => `https://www.pkavi.com/vs/-------------.html?wd=${q}` },
  { group: '浮光间', note: '在线观影', icon: 'N', name: '奈飞工厂', meta: '最新美剧，无广告（需梯子）', url: q => `https://www.netflixgc.com/vodsearch/-------------.html?wd=${q}` },
  { group: '浮光间', note: '在线观影', icon: '独', name: '独播库', meta: '页面无广告，纯净', url: q => `https://www.dbku.tv/vodsearch/-------------.html?wd=${q}` },
  { group: '浮光间', note: '在线观影', icon: 'P', name: 'PPnix', meta: '热门在线影视，速度快／纯净／无广告', url: q => `https://www.ppnix.com/cn/search/${q}--.html` },
  { group: '浮光间', note: '在线观影', icon: '泥', name: '泥视频', meta: '热门国剧，更新快，无广告', url: q => `https://www.nivod.vip/s/-------------/?wd=${q}` },
  { group: '浮光间', note: '在线观影', icon: '爱', name: '爱看机器人', meta: '全网热门的电影和电视剧榜单', url: q => `https://www1.aikanbot.com/search?q=${q}` },
  { group: '云上集', note: '网盘资源', icon: '盘', name: '盘搜', meta: '纯净的夸克网盘资源搜索引擎', url: q => `https://pansou.de/search?q=${q}&platform=quark` },
  { group: '云上集', note: '网盘资源', icon: '追', name: '追剧网', meta: '国内外热门影视网盘资源搜索', url: q => `https://www.zhuiju.us/s/${q}.html` },
  { group: '云上集', note: '网盘资源', icon: 'K', name: 'KKSO', meta: '夸克百度网盘搜索', url: q => `https://kkso.net/s/${q}.html` },
  { group: '云上集', note: '网盘资源', icon: '资', name: '资源库', meta: '打开后自行输入访问密码', url: () => 'http://xccji.top/app/index.html?id=200317xlb' }
];

const form = document.querySelector('#searchForm');
const input = document.querySelector('#filmInput');
const clearInput = document.querySelector('#clearInput');
const results = document.querySelector('#results');
const searchHint = document.querySelector('.search-hint');
const recentSearches = document.querySelector('#recentSearches');
const historyKey = 'find-a-film-recent-searches';

function escapeHtml(value) { const div = document.createElement('div'); div.textContent = value; return div.innerHTML; }
function readHistory() { try { return JSON.parse(localStorage.getItem(historyKey) || '[]').filter(item => typeof item === 'string'); } catch { return []; } }
function remember(query) { localStorage.setItem(historyKey, JSON.stringify([query, ...readHistory().filter(item => item !== query)].slice(0, 6))); }
function removeHistory(query) { localStorage.setItem(historyKey, JSON.stringify(readHistory().filter(item => item !== query))); }
function updateClearInput() { clearInput.hidden = !input.value.length; }
function renderHistory() {
  const items = readHistory();
  recentSearches.hidden = !items.length;
  if (!items.length) return;
  recentSearches.innerHTML = `<div class="recent-title">最近搜索</div><div class="recent-list">${items.map(item => `<div class="history-chip"><button class="history-query" type="button" data-query="${encodeURIComponent(item)}">${escapeHtml(item)}</button><button class="history-remove" type="button" data-remove="${encodeURIComponent(item)}" aria-label="删除 ${escapeHtml(item)}">×</button></div>`).join('')}</div>`;
}
function search(query) {
  const clean = query.trim();
  if (!clean) { input.focus(); return; }
  input.value = clean; updateClearInput(); remember(clean);
  const encoded = encodeURIComponent(clean);
  const groups = [...new Set(platforms.map(platform => platform.group))];
  results.innerHTML = `<div class="result-intro"><div class="eyebrow">SEARCHING FOR</div><h2>${escapeHtml(clean)}</h2></div>` + groups.map((group, index) => {
    const cards = platforms.filter(platform => platform.group === group).map(platform => `<button class="platform-card" type="button" data-platform-url="${platform.url(encoded)}"><span class="platform-icon${/[A-Za-z]/.test(platform.icon) ? ' platform-icon-latin' : ''}${platform.icon === '豆' ? ' platform-icon-bean' : ''}"><span class="platform-icon-glyph">${platform.icon}</span></span><span><span class="platform-name">${platform.name}</span><span class="platform-meta">${platform.meta}</span></span></button>`).join('');
    const note = platforms.find(platform => platform.group === group).note;
    return `<div class="platform-section platform-section-${index + 1}"><div class="platform-label"><span class="platform-label-title">${group}</span><span class="platform-label-dot">·</span><span class="platform-label-note">${note}</span></div><div class="platform-list">${cards}</div></div>`;
  }).join('');
  results.classList.add('show'); searchHint.hidden = true; recentSearches.hidden = true;
}

form.addEventListener('submit', event => { event.preventDefault(); search(input.value); });
input.addEventListener('focus', renderHistory);
input.addEventListener('input', updateClearInput);
clearInput.addEventListener('mousedown', event => event.preventDefault());
clearInput.addEventListener('click', () => { input.value = ''; updateClearInput(); input.focus(); });
recentSearches.addEventListener('click', event => {
  const removeButton = event.target.closest('button[data-remove]');
  if (removeButton) { removeHistory(decodeURIComponent(removeButton.dataset.remove)); renderHistory(); return; }
  const queryButton = event.target.closest('button[data-query]');
  if (queryButton) search(decodeURIComponent(queryButton.dataset.query));
});
results.addEventListener('click', event => {
  const platformButton = event.target.closest('button[data-platform-url]');
  if (platformButton) window.open(platformButton.dataset.platformUrl, '_blank', 'noopener,noreferrer');
});
updateClearInput(); renderHistory();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
