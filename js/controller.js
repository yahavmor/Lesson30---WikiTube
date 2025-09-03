'use strict';

function init() {
    if (gCacheVideos.length) {
        renderVideos(gCacheVideos);
    } else {
        fetchAndRender();
    }
    renderMainVideo(gCacheVideos[0]);
    fetchAndRenderWiki('pizza');
    renderSearchHistory(gCacheSearches)
    focusSearchBar()

}

function focusSearchBar(){
    var elInput = document.querySelector('.search-input')
    elInput.focus()
}

function renderMainVideo(video) {
    var mainVideoContainer = document.querySelector('.main-video-container');
    mainVideoContainer.innerHTML = '';
    const videoId = video.id.videoId;
    const strHtml = `
        <div class="main-video-item">
            <iframe class="main-video" width="500" height="350"  
                src="https://www.youtube.com/embed/${videoId}"        
            </iframe>
        </div>`
    mainVideoContainer.innerHTML = strHtml;
}

function renderVideos(videos) {
    var videoContainer = document.querySelector('.video-container');
    videoContainer.innerHTML = '';
    var strHtml = '';
    videos.forEach((video, index) => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        strHtml += `
            <div class="video-item" data-index="${index}" onclick="onDisplayMain(gCacheVideos[${index}])">
                <h4 class="video-title">${title}</h4>
                <iframe class="sec-video"  
                    src="https://www.youtube.com/embed/${videoId}"
                    frameborder="0" allowfullscreen>
                </iframe>
            </div>`;
    });
    videoContainer.innerHTML = strHtml;
}

function onDisplayMain(video){
    renderMainVideo(video)
}
function search(){
    const elInput = document.querySelector('.search-input')
    const value = elInput.value
    fetchAndRenderWiki(value)
    renderSearchHistory(value)
    addToCache(value)
}
function renderWiki(search) {
    const wikiContainer = document.querySelector('.wikipedia-container');
    wikiContainer.innerHTML = '';
    var strHtml = ''
    if (!search || search.length === 0) {
        wikiContainer.innerHTML = '<p>No Wikipedia results found.</p>';
        return;
    }
    const result = search[0]

     strHtml+= `
        <div class="wiki-item">
            <h4 class="wiki-title">${result.title}</h4>
            <p class="wiki-snippet">${result.snippet}</p>
            <a href="https://en.wikipedia.org/?curid=${result.pageid}" target="_blank" class="wiki-link">Read more</a>
        </div>`

    wikiContainer.innerHTML = strHtml;
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        search(); 
    }
}

function renderSearchHistory(value) {
    var elSearchHistoryContainer = document.querySelector('.search-history-container');

    // If the value is an array, reverse it to show the most recent searches first
    if (Array.isArray(value)) {
        elSearchHistoryContainer.innerHTML = ''; 
        value.slice().reverse().forEach(item => { // Use slice() to avoid mutating the original array
            elSearchHistoryContainer.innerHTML += `<span class="search-history-item">${item}</span>`;
        });
    } else {
        // Append a single value to the container
        elSearchHistoryContainer.innerHTML = `<span class="search-history-item">${value}</span>` + elSearchHistoryContainer.innerHTML;
    }
}

function addToCache(value){
    if (gCacheSearches.length===8) return
    gCacheSearches.push(value);
    saveToStorage(STORAGE_KEY_SEARCHES, gCacheSearches);
}
function clearHistory(){
    gCacheSearches = []
    var elModal = document.querySelector('.confirm-deletion-modal')
    renderSearchHistory(gCacheSearches)
}