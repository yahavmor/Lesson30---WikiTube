"use strict";

function init() {
  if (gCacheVideos.length && gCacheVideos.length <= 4) {
    renderVideos(gCacheVideos);
    renderMainVideo(gCacheVideos[0]);
  } else {
    fetchAndRenderVideos(defaultSearchTerm);
  }
  fetchAndRenderWiki(defaultSearchTerm);
  renderSearchHistory(gCacheSearches);
  focusSearchBar();
}
function focusSearchBar() {
  var elInput = document.querySelector(".search-input");
  elInput.focus();
}
function renderMainVideo(video) {
  var mainVideoContainer = document.querySelector(".main-video-container");

  mainVideoContainer.innerHTML = "";

  const videoId = video.id.videoId;

  const strHtml = `

        <div class="main-video-item">

            <iframe class="main-video" width="500" height="350"  

                src="https://www.youtube.com/embed/${videoId}"        

            </iframe>

        </div>`;

  mainVideoContainer.innerHTML = strHtml;
}

function renderVideos(videos) {
  var videoContainer = document.querySelector(".video-container");

  videoContainer.innerHTML = "";

  var strHtml = "";
  const chosenVideos = videos.slice(0, 5);

  chosenVideos.forEach((video, index) => {
    const videoId = video.id.videoId;

    const title = video.snippet.title;

    strHtml += `

            <div class="video-item" data-index="${index}" onclick="onDisplayMain(${index})"
">

                <h4 class="video-title">${title}</h4>

                <iframe class="sec-video"  

                    src="https://www.youtube.com/embed/${videoId}"

                    frameborder="0" allowfullscreen>

                </iframe>

            </div>`;
  });

  videoContainer.innerHTML = strHtml;
}

function onDisplayMain(index) {
  const video = gCacheVideos[index];
  renderMainVideo(video);
}


function search() {
  const elInput = document.querySelector(".search-input");

  const value = elInput.value.trim();

  if (!value) return;

  fetchAndRenderVideos(value);

  fetchAndRenderWiki(value);

  addToCache(value);

  renderSearchHistory(gCacheSearches);
}

function renderWiki(search) {
  const wikiContainer = document.querySelector(".wikipedia-container");

  wikiContainer.innerHTML = "";

  var strHtml = "";

  if (!search || search.length === 0) {
    wikiContainer.innerHTML = "<p>No Wikipedia results found.</p>";

    return;
  }

  const result = search[0];

  strHtml += `

        <div class="wiki-item">

            <h4 class="wiki-title">${result.title}</h4>

            <p class="wiki-snippet">${result.snippet}</p>

            <a href="https://en.wikipedia.org/?curid=${result.pageid}" target="_blank" class="wiki-link">Read more</a>

        </div>`;

  wikiContainer.innerHTML = strHtml;
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    search();
  }
}

function renderSearchHistory(value) {
  const elSearchHistoryContainer = document.querySelector(
    ".search-history-container",
  );

  elSearchHistoryContainer.innerHTML = "";

  const historyItems = Array.isArray(value) ? value.slice().reverse() : [value];

  historyItems.forEach((item) => {
    elSearchHistoryContainer.innerHTML += `

        <span class="search-history-item" onclick="onClickedSearchTerm('${item}')">${item}</span>`;
  });
}

function onClickedSearchTerm(item) {
  fetchAndRenderVideos(item);

  fetchAndRenderWiki(item);

  renderSearchHistory(gCacheSearches);
}

function addToCache(value) {
  if (gCacheSearches.length === 8) return;

  gCacheSearches.push(value);

  saveToStorage(STORAGE_KEY_SEARCHES, gCacheSearches);
}

function onClearBtn() {
    if(!gCacheSearches.length) return
  document.body.style.opacity = "0.6";

  showDeleteModal().then((confirmed) => {
    if (confirmed) {
      gCacheSearches = [];

      saveToStorage(STORAGE_KEY_SEARCHES, gCacheSearches);

      renderSearchHistory(gCacheSearches);
    }

    document.body.style.opacity = "1";
  });
}

function showDeleteModal() {
  const elModalDeletion = document.querySelector(".confirm-deletion-modal");

  const confirmBtnDeletion = document.querySelector(".btn-confirm");

  const cancelBtnDeletion = document.querySelector(".btn-cancel");

  elModalDeletion.showModal();

  return new Promise((resolve) => {
    const close = (result) => {
      elModalDeletion.close();

      resolve(result);
    };

    const onConfirm = () => close(true);

    const onCancel = () => close(false);

    confirmBtnDeletion.addEventListener("click", onConfirm);

    cancelBtnDeletion.addEventListener("click", onCancel);
  });
}

let colorChange = true;

function changeTheme() {
  const elHeader = document.querySelector("header");

  const elFooter = document.querySelector("footer");

  const elMain = document.querySelector("main");

  const ThemeChangeButton = document.querySelector(".Theme-change button");

  if (colorChange) {
    elHeader.style.backgroundColor = "#1F1F1F";

    elFooter.style.backgroundColor = "#2C2C2C";

    elMain.style.backgroundColor = "#121212";

    ThemeChangeButton.style.backgroundColor = "#444";

    ThemeChangeButton.style.color = "#ffffff";
  } else {
    elHeader.style.backgroundColor = "#007BFF";

    elFooter.style.backgroundColor = "#007BFF";

    elMain.style.backgroundColor = "#ffffff";

    ThemeChangeButton.style.backgroundColor = "#ffffff";

    ThemeChangeButton.style.color = "#444";
  }

  colorChange = !colorChange;
}

function onChangeTheme() {
  document.body.style.opacity = "0.6";

  changeThemeModal().then((confirmed) => {
    if (confirmed) {
      changeTheme();
    }

    document.body.style.opacity = "1";
  });
}

function changeThemeModal() {
  const elModalColorTheme = document.querySelector(".confirm-Theme-modal");

  const confirmBtnColorTheme = document.querySelector(".btn-confirm-change");

  const cancelBtnDColorTheme = document.querySelector(".btn-cancel-change");

  elModalColorTheme.showModal();

  return new Promise((resolve) => {
    const close = (result) => {
      elModalColorTheme.close();

      resolve(result);
    };

    const onConfirm = () => close(true);

    const onCancel = () => close(false);

    confirmBtnColorTheme.addEventListener("click", onConfirm);

    cancelBtnDColorTheme.addEventListener("click", onCancel);
  });
}
