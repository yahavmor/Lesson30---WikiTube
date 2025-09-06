"use strict"

function init() {
  const shouldRenderCache = gCacheVideos.length > 0 && gCacheVideos.length <= 4

  if (shouldRenderCache) {
    renderVideos(gCacheVideos)
    renderMainVideo(gCacheVideos[0])
  } else {
    fetchVideos(defaultSearchTerm).then(() => {
      renderVideos(gCacheVideos)
      renderMainVideo(gCacheVideos[0])
    })
  }

  fetchWiki(defaultSearchTerm).then(renderWiki)
  renderSearchHistory(gCacheSearches)
  focusSearchBar()
}

function search() {
  const elInput = document.querySelector(".search-input")
  const value = elInput.value.trim()
  if (!value) return

  fetchVideos(value).then(() => {
    renderVideos(gCacheVideos)
    renderMainVideo(gCacheVideos[0])
  })

  fetchWiki(value).then(renderWiki)
  addToCache(value)
  renderSearchHistory(gCacheSearches)
}

function onClickedSearchTerm(item) {
  fetchVideos(item).then(() => {
    renderVideos(gCacheVideos)
    renderMainVideo(gCacheVideos[0])
  })

  fetchWiki(item).then(renderWiki)
  renderSearchHistory(gCacheSearches)
}

function onDisplayMain(index) {
  renderMainVideo(gCacheVideos[index])
}

function handleKeyPress(event) {
  if (event.key === "Enter") search()
}

function renderVideos(videos) {
  const videoContainer = document.querySelector(".video-container")
  const chosenVideos = videos.slice(0, 5)

  const strHtml = chosenVideos.map((video, index) => {
    const videoId = video.id.videoId
    const title = video.snippet.title
    return `
      <div class="video-item" data-index="${index}" onclick="onDisplayMain(${index})">
        <h4 class="video-title">${title}</h4>
        <iframe class="sec-video" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
      </div>`
  }).join("")

  videoContainer.innerHTML = strHtml
}

function renderMainVideo(video) {
  const videoId = video.id.videoId
  const mainVideoContainer = document.querySelector(".main-video-container")

  mainVideoContainer.innerHTML = `
    <div class="main-video-item">
      <iframe class="main-video" width="500" height="350" src="https://www.youtube.com/embed/${videoId}"></iframe>
    </div>`
}

function renderWiki(results) {
  const wikiContainer = document.querySelector(".wikipedia-container")
  if (!results || results.length === 0) {
    wikiContainer.innerHTML = "<p>No Wikipedia results found.</p>"
    return
  }

  const result = results[0]
  wikiContainer.innerHTML = `
    <div class="wiki-item">
      <h4 class="wiki-title">${result.title}</h4>
      <p class="wiki-snippet">${result.snippet}</p>
      <a href="https://en.wikipedia.org/?curid=${result.pageid}" target="_blank" class="wiki-link">Read more</a>
    </div>`
}

function renderSearchHistory(history) {
  const elSearchHistoryContainer = document.querySelector(".search-history-container")
  const items = Array.isArray(history) ? history.slice().reverse() : [history]

  const strHtml = items.map(item => `
    <span class="search-history-item" onclick="onClickedSearchTerm('${item}')">${item}</span>
  `).join("")

  elSearchHistoryContainer.innerHTML = strHtml
}

function focusSearchBar() {
  document.querySelector(".search-input").focus()
}

function onClearBtn() {
  if (!gCacheSearches.length) return
  document.body.classList.add("dimmed")

  showDeleteModal().then((confirmed) => {
    if (confirmed) {
      gCacheSearches.length = 0
      saveToStorage(STORAGE_KEY_SEARCHES, gCacheSearches)
      renderSearchHistory(gCacheSearches)
    }
    document.body.classList.remove("dimmed")
  })
}

function showDeleteModal() {
  const elModal = document.querySelector(".confirm-deletion-modal")
  const confirmBtn = document.querySelector(".btn-confirm")
  const cancelBtn = document.querySelector(".btn-cancel")

  elModal.showModal()

  return new Promise((resolve) => {
    const close = (result) => {
      elModal.close()
      resolve(result)
    }

    confirmBtn.onclick = () => close(true);
    cancelBtn.onclick = () => close(false);
  })
}

let colorChange = true

function changeTheme() {
  const elHeader = document.querySelector("header")
  const elFooter = document.querySelector("footer")
  const elMain = document.querySelector("main")
  const btn = document.querySelector(".Theme-change button")
  const elData = document.querySelector('.wiki-snippet')

  if (colorChange) {
    elHeader.style.backgroundColor = "#1F1F1F"
    elFooter.style.backgroundColor = "#2C2C2C"
    elMain.style.backgroundColor = "#121212"
    btn.style.backgroundColor = "#444"
    btn.style.color = "#fff"
    elData.style.color ="#fff"
  } else {
    elHeader.style.backgroundColor = "#007BFF"
    elFooter.style.backgroundColor = "#007BFF"
    elMain.style.backgroundColor = "#fff"
    btn.style.backgroundColor = "#fff"
    btn.style.color = "#444"
    elData.style.color ="#444"
  }

  colorChange = !colorChange
}

function onChangeTheme() {
  document.body.classList.add("dimmed")

  changeThemeModal().then((confirmed) => {
    if (confirmed) changeTheme()
    document.body.classList.remove("dimmed")
  })
}

function changeThemeModal() {
  const elModal = document.querySelector(".confirm-Theme-modal")
  const confirmBtn = document.querySelector(".btn-confirm-change")
  const cancelBtn = document.querySelector(".btn-cancel-change")

  elModal.showModal()

  return new Promise((resolve) => {
    const close = (result) => {
      elModal.close()
      resolve(result)
    }

   confirmBtn.onclick = () => close(true);
   cancelBtn.onclick = () => close(false);
  })
}
