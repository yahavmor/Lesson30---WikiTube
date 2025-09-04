
'use strict';

const YT_KEY = 'AIzaSyDqo_CiDO6mUSVRha6bN8OQhrQ8BVMeELA';
const STORAGE_KEY = 'videos'
const gCacheVideos = loadFromStorage(STORAGE_KEY) || []
let defaultSearchTerm = 'pizza';
const STORAGE_KEY_SEARCHES = 'searches'
var gCacheSearches = loadFromStorage(STORAGE_KEY_SEARCHES) || []






function fetchAndRenderVideos(searchTerm) {
    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchTerm)}&type=video&maxResults=5&key=${YT_KEY}`;
    fetch(youtubeApiUrl)
      .then(res => res.json())
      .then(data => {
        gCacheVideos.length = 0; 
        gCacheVideos.push(...data.items); 
        saveToStorage(STORAGE_KEY, gCacheVideos);
        renderVideos(data.items);
        renderMainVideo(data.items[0]);
      })
      .catch(err => console.error('Failed to fetch videos:', err));
  }
  


function fetchAndRenderWiki(value) {
    const wikipediaUrl = `https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=${encodeURIComponent(value)}&format=json`;
  
    fetch(wikipediaUrl)
      .then(res => res.json())
      .then(data => {
        renderWiki(data.query.search);
      })
      .catch(err => console.error('Failed to fetch Wikipedia data:', err));
  }
  
