'use strict';

function init(){
    if (gCacheVideos.length) {
        renderVideos(gCacheVideos)
    }else{
        fetchAndRender()
    }
}




function renderVideos(videos){
    var videoContainer = document.querySelector('.video-container');
    videoContainer.innerHTML = '';
    var strHtml = '';
    videos.forEach(video => {
        if (!video.id.videoId) return; // Skip items without videoId
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        strHtml += `
            <div class="video-item">
                <h4 class="video-title">${title}</h4>
                <iframe width="320" height="215"
                    src="https://www.youtube.com/embed/${videoId}"
                    frameborder="0" allowfullscreen>
                </iframe>
            </div>
        `;
    });
    videoContainer.innerHTML = strHtml;
}



