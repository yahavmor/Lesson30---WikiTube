'use strict';

const YT_KEY = 'AIzaSyDXbgdUPtREF_hBXf4O-Y1mv3O4ARJnkWc';
const value = 5;
const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=${YT_KEY}&q=${value}`;


const STORAGE_KEY = 'videos'
const gCacheVideos = loadFromStorage(STORAGE_KEY) || []






console.log('Cached videos:', gCacheVideos)



function fetchAndRender() {
    fetch(youtubeApiUrl)
        .then(res => res.json())
        .then(data => {
            renderVideos(data.items);
            gCacheVideos.push(...data.items);
            saveToStorage(STORAGE_KEY, gCacheVideos);
        })
        .catch(err => console.error('Failed to fetch videos:', err));
}

