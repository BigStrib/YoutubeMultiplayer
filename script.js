document.addEventListener('DOMContentLoaded', () => {
    const urlInput        = document.getElementById('url-input');
    const addButton       = document.getElementById('add-video-btn');
    const videoGrid       = document.getElementById('video-grid-container');
    const sidebar         = document.getElementById('sidebar');
    const sidebarToggle   = document.getElementById('sidebar-toggle');
    const sidebarClose    = document.getElementById('sidebar-close');
    const sidebarOverlay  = document.getElementById('sidebar-overlay');
    const videoCountDisplay = document.getElementById('video-count-display');

    /* ========================
       SIDEBAR CONTROL
       ======================== */
    function openSidebar() {
        document.body.classList.add('sidebar-open');
        setTimeout(() => urlInput.focus(), 300);
    }

    function closeSidebar() {
        document.body.classList.remove('sidebar-open');
        urlInput.blur();
    }

    function isSidebarOpen() {
        return document.body.classList.contains('sidebar-open');
    }

    function toggleSidebar() {
        if (isSidebarOpen()) closeSidebar();
        else openSidebar();
    }

    /* ========================
       VIDEO COUNT / GRID STATE
       ======================== */
    function getVideoCount() {
        return videoGrid.querySelectorAll('.video-item').length;
    }

    function updateVideoCount() {
        const count = getVideoCount();
        videoCountDisplay.textContent = count;

        videoGrid.classList.remove('has-videos', 'has-1');
        if (count > 0) {
            videoGrid.classList.add('has-videos');
        }
        if (count === 1) {
            videoGrid.classList.add('has-1');
        }
    }

    /* ========================
       YOUTUBE URL PARSER
       ======================== */
    function parseVideoUrl(url) {
        if (!url) return null;
        url = url.trim();

        const ytPatterns = [
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i,
            /^([a-zA-Z0-9_-]{11})$/   // direct video ID
        ];

        for (const pattern of ytPatterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return {
                    type: 'youtube',
                    id: match[1],
                    url: `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&playsinline=1&showinfo=0&iv_load_policy=3`
                };
            }
        }
        return null;
    }

    /* ========================
       CREATE VIDEO ELEMENT
       ======================== */
    function createVideoElement(videoData) {
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');
        // allow duplicates: each instance gets unique id
        videoItem.dataset.videoId = videoData.id + '-' + Date.now();
        videoItem.dataset.videoType = videoData.type;
        videoItem.setAttribute('role', 'listitem');

        videoItem.innerHTML = `
            <div class="video-responsive">
                <iframe 
                    src="${videoData.url}" 
                    title="${videoData.type} video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen
                ></iframe>
            </div>

            <div class="video-controls-overlay">
                <button class="move-btn" title="Drag to reorder" aria-label="Drag to reorder">
                    <i class="fas fa-grip-vertical"></i>
                </button>
                <button class="remove-btn" title="Remove video" aria-label="Remove video">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="confirm-remove-overlay">
                <div class="confirm-remove-box">
                    <div class="confirm-remove-label">Remove this video?</div>
                    <div class="confirm-remove-actions">
                        <button class="confirm-cancel-btn" title="Cancel" aria-label="Cancel remove">
                            <i class="fas fa-times-circle"></i>
                        </button>
                        <button class="confirm-ok-btn" title="Remove" aria-label="Confirm remove">
                            <i class="fas fa-check-circle"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        const removeBtn      = videoItem.querySelector('.remove-btn');
        const confirmOverlay = videoItem.querySelector('.confirm-remove-overlay');
        const cancelBtn      = videoItem.querySelector('.confirm-cancel-btn');
        const okBtn          = videoItem.querySelector('.confirm-ok-btn');

        // Show confirm overlay when clicking X
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            videoItem.classList.add('show-confirm-remove');
        });

        // Cancel removal
        cancelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            videoItem.classList.remove('show-confirm-remove');
        });

        // Confirm removal
        okBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            videoItem.classList.remove('show-confirm-remove');
            videoItem.style.opacity = '0';
            videoItem.style.transform = 'scale(0.9)';
            videoItem.style.transition = 'all 0.2s ease';
            setTimeout(() => {
                videoItem.remove();
                updateVideoCount();
            }, 200);
        });

        return videoItem;
    }

    /* ========================
       ADD VIDEO
       ======================== */
    function addVideo() {
        const inputUrl = urlInput.value.trim();
        if (!inputUrl) {
            shakeInput();
            return;
        }

        const videoData = parseVideoUrl(inputUrl);
        if (!videoData) {
            shakeInput();
            showToast('Invalid YouTube URL', 'error');
            return;
        }

        const newVideo = createVideoElement(videoData);
        newVideo.style.opacity = '0';
        newVideo.style.transform = 'scale(0.95)';

        videoGrid.appendChild(newVideo);

        requestAnimationFrame(() => {
            newVideo.style.transition = 'all 0.3s ease';
            newVideo.style.opacity = '1';
            newVideo.style.transform = 'scale(1)';
        });

        urlInput.value = '';
        updateVideoCount();
        closeSidebar();
        showToast('Video added', 'success');
    }

    /* ========================
       UI HELPERS
       ======================== */
    function shakeInput() {
        urlInput.style.animation = 'shake 0.4s ease';
        urlInput.addEventListener('animationend', () => {
            urlInput.style.animation = '';
        }, { once: true });
    }

    function showToast(message, type = 'success') {
        const existing = document.querySelector('.toast-message');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast-message ${type}`;
        const icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';
        toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    /* ========================
       EVENT LISTENERS
       ======================== */
    sidebarToggle.addEventListener('click', openSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    addButton.addEventListener('click', addVideo);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addVideo();
    });

    urlInput.addEventListener('paste', () => {
        setTimeout(() => {
            if (urlInput.value.trim()) addVideo();
        }, 100);
    });

    // Hotkeys: Shift toggles sidebar, Esc closes
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Shift' && document.activeElement !== urlInput) {
            e.preventDefault();
            toggleSidebar();
        }
        if (e.key === 'Escape' && isSidebarOpen()) {
            closeSidebar();
        }
    });

    /* ========================
       SORTABLE (Drag & Drop)
       ======================== */
    if (typeof Sortable !== 'undefined') {
        new Sortable(videoGrid, {
            animation: 250,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            handle: '.move-btn',
            filter: '.remove-btn, .empty-state',
            preventOnFilter: false,
            ghostClass: 'sortable-ghost',
            forceFallback: true,
            fallbackTolerance: 3,

            onStart(evt) {
                evt.item.classList.add('is-dragging');
                document.querySelectorAll('.video-item iframe').forEach(f => {
                    f.style.pointerEvents = 'none';
                });
            },

            onEnd(evt) {
                evt.item.classList.remove('is-dragging');
                document.querySelectorAll('.video-item iframe').forEach(f => {
                    f.style.pointerEvents = '';
                });
            }
        });
    }

    // Initial
    updateVideoCount();
});