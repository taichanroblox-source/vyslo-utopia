```javascript
const form = document.getElementById("address-form");
const address = document.getElementById("address");
const viewer = document.getElementById("viewer");
const viewerWrap = document.getElementById("viewer-wrap");
const empty = document.getElementById("empty");
const notice = document.getElementById("notice");
const openNew = document.getElementById("open-new");
const youtubeFrame = document.getElementById("youtube-frame");
const currentAddress = document.getElementById("current-address");
const back = document.getElementById("back");
const forward = document.getElementById("forward");
const reload = document.getElementById("reload");

let historyList = [];
let historyIndex = -1;
let currentUrl = "";

function normalizeUrl(value) {
  const raw = value.trim();
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      return url.protocol === "http:" || url.protocol === "https:"
        ? url.href : null;
    } catch {
      return null;
    }
  }

  if (/^[\w.-]+\.[a-z]{2,}([/:?#]|$)/i.test(raw)) {
    try {
      return new URL("https://" + raw).href;
    } catch {
      return null;
    }
  }

  return "https://www.google.com/search?q=" + encodeURIComponent(raw);
}

function getYouTubeId(url) {
  try {
    const u = new URL(url);

    if (u.hostname === "youtu.be") {
      return u.pathname.split("/").filter(Boolean)[0] || null;
    }

    if (
      u.hostname === "youtube.com" ||
      u.hostname.endsWith(".youtube.com")
    ) {
      if (u.pathname === "/watch") {
        return u.searchParams.get("v");
      }

      const match = u.pathname.match(
        /^\/(?:embed|shorts|live)\/([a-zA-Z0-9_-]+)/
      );

      return match ? match[1] : null;
    }
  } catch {}

  return null;
}

function updateButtons() {
  back.disabled = historyIndex <= 0;
  forward.disabled = historyIndex >= historyList.length - 1;
  reload.disabled = !currentUrl;
}

function navigate(value, addHistory = true) {
  const url = normalizeUrl(value);

  if (!url) {
    notice.textContent = "URLを確認してね。";
    return;
  }

  currentUrl = url;
  address.value = url;
  currentAddress.textContent = url;
  openNew.href = url;
  openNew.style.pointerEvents = "auto";
  viewerWrap.hidden = false;
  viewer.hidden = true;
  youtubeFrame.hidden = true;
  youtubeFrame.replaceChildren();

  const videoId = getYouTubeId(url);

  if (videoId) {
    const iframe = document.createElement("iframe");
    iframe.src =
      "https://www.youtube-nocookie.com/embed/" +
      encodeURIComponent(videoId);
    iframe.title = "YouTube動画";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";

    youtubeFrame.appendChild(iframe);
    youtubeFrame.hidden = false;
    notice.textContent = "YouTube動画を読み込んでいるよ。";
  } else {
    viewer.src = url;
    viewer.hidden = false;
    notice.textContent =
      "読み込み中！表示されないサイトは「新しいタブ」で開いてね。";
  }

  if (addHistory) {
    historyList = historyList.slice(0, historyIndex + 1);
    historyList.push(url);
    historyIndex = historyList.length - 1;
  }

  updateButtons();
}

form.addEventListener("submit", event => {
  event.preventDefault();
  navigate(address.value);
});

document.querySelectorAll("[data-url]").forEach(button => {
  button.addEventListener("click", () => navigate(button.dataset.url));
});

back.addEventListener("click", () => {
  if (historyIndex > 0) {
    historyIndex--;
    navigate(historyList[historyIndex], false);
  }
});

forward.addEventListener("click", () => {
  if (historyIndex < historyList.length - 1) {
    historyIndex++;
    navigate(historyList[historyIndex], false);
  }
});

reload.addEventListener("click", () => {
  if (currentUrl) navigate(currentUrl, false);
});

viewer.addEventListener("load", () => {
  if (currentUrl && !viewer.hidden) {
    notice.textContent =
      "表示を試みたよ。サイト側が埋め込みを禁止している場合は、新しいタブで開いてね。";
  }
});

console.log("VYSLO UTOPIA 起動成功");
updateButtons();
```
