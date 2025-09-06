
'use strict'

const YT_KEY = 'AIzaSyDqo_CiDO6mUSVRha6bN8OQhrQ8BVMeELA'
const STORAGE_KEY = 'videos'
const STORAGE_KEY_SEARCHES = 'searches'
const gCacheVideos = loadFromStorage(STORAGE_KEY) || []
var gCacheSearches = loadFromStorage(STORAGE_KEY_SEARCHES) || []
let defaultSearchTerm = 'pizza'

function fetchVideos(searchTerm) {
  const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchTerm)}&type=video&maxResults=5&key=${YT_KEY}`
  return fetch(youtubeApiUrl)
    .then(res => res.json())
    .then(data => {
      gCacheVideos.length = 0
      gCacheVideos.push(...data.items)
      saveToStorage(STORAGE_KEY, gCacheVideos)
    })
    .catch(err => console.error('Failed to fetch videos:', err))
}



function fetchWiki(value) {
  const wikipediaUrl = `https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=${encodeURIComponent(value)}&format=json`

  return fetch(wikipediaUrl)
    .then(res => res.json())
    .then(data => data.query.search)
    .catch(err => {
      console.error('Failed to fetch Wikipedia data:', err)
      return []
    })
}

function addToCache(value) {
  if (gCacheSearches.includes(value)) return
  if (gCacheSearches.length === 8) return

  gCacheSearches.unshift(value)
  saveToStorage(STORAGE_KEY_SEARCHES, gCacheSearches)
}

