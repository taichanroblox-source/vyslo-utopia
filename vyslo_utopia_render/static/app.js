const form = document.getElementById("address-form");
const address = document.getElementById("address");
const viewer = document.getElementById("viewer");
const empty = document.getElementById("empty");
const notice = document.getElementById("notice");
const openNew = document.getElementById("open-new");
let historyList = [];
let historyIndex = -1;
let currentUrl = "";

function normalizeUrl(value) {
  let raw = value.trim();
  if (!raw) return null;
  if (!/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(raw)) raw = "https://" + raw;
  try {
    const u = new URL(raw);
    if (!["http:", "https:"].includes(u.protocol)) return null;
    return u.href;
  } catch { return null; }
}

function navigate(value, addHistory = true) {
  const url = normalizeUrl(value);
  if (!url) {
    notice.textContent = "URLを確認してね。http:// または https:// のWebアドレスを入力してね。";
    return;
  }
  currentUrl = url;
  address.value = url;
  viewer.src = url;
  viewer.hidden = false;
  empty.hidden = true;
  openNew.disabled = false;
  notice.textContent = "ページを読み込んでいるよ。表示されない場合は「新しいタブで開く」を試してね。";
  if (addHistory) {
    historyList = historyList.slice(0, historyIndex + 1);
    historyList.push(url);
    historyIndex = historyList.length - 1;
  }
}
form.addEventListener("submit", e => { e.preventDefault(); navigate(address.value); });
document.querySelectorAll("[data-url]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.url)));
document.getElementById("back").addEventListener("click", () => {
  if (historyIndex > 0) { historyIndex--; navigate(historyList[historyIndex], false); }
});
document.getElementById("forward").addEventListener("click", () => {
  if (historyIndex < historyList.length - 1) { historyIndex++; navigate(historyList[historyIndex], false); }
});
document.getElementById("reload").addEventListener("click", () => {
  if (currentUrl) { viewer.src = currentUrl; }
});
openNew.addEventListener("click", () => {
  if (currentUrl) window.open(currentUrl, "_blank", "noopener,noreferrer");
});
viewer.addEventListener("load", () => {
  if (currentUrl) notice.textContent = "表示を試みたよ。サイト側が埋め込みを禁止している場合は、新しいタブで開いてね。";
});
console.log("VYSLO 起動成功");
