'use strict';

const YT_KEY = 'AIzaSyDXbgdUPtREF_hBXf4O-Y1mv3O4ARJnkWc';
const value = 5;
const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=${YT_KEY}&q=${value}`;

const STORAGE_KEY = 'videos'
const gCacheVideos = loadFromStorage(STORAGE_KEY) || []

const STORAGE_KEY_SEARCHES = 'searches'
var gCacheSearches = loadFromStorage(STORAGE_KEY_SEARCHES) || []






function fetchAndRender() {
    fetch(youtubeApiUrl)
        .then(res => res.json())
        .then(data => {
            renderVideos(data.items);
            gCacheVideos.push(...data.items);
            saveToStorage(STORAGE_KEY, gCacheVideos);
            renderMainVideo(data.items[0]); 
        })
        .catch(err => console.error('Failed to fetch videos:', err));
}


function fetchAndRenderWiki(value) {
    const wikipediaUrl = `https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=${encodeURIComponent(value)}&format=json`;
    fetch(wikipediaUrl)
        .then(res => res.json())
        .then(data => {
            const search = data.query.search;
            renderWiki(search)
        })
        .catch(err => console.error('Failed to fetch Wikipedia data:', err));
}