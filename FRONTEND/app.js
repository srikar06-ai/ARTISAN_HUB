/* ============================================================
   ARTISAN HUB — Application Logic (app.js)
   Uses localStorage for offline demo functionality
   ============================================================ */

// ---- Sample Artwork Data (Pre-seeded) ----
const SAMPLE_ARTWORKS = [
    {
        id: 'art-1',
        title: 'Whispers of the Monsoon',
        description: 'An oil painting capturing the first rains over the Western Ghats. The mist rolls over the green hills as a lone figure watches from a stone bridge.',
        category: 'Painting',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
        artistId: 'user-sample-1',
        artistName: 'Arjun Mehta',
        likes: 142,
        views: 1820,
        createdAt: '2026-01-15T10:00:00'
    },
    {
        id: 'art-2',
        title: 'Neon Deity',
        description: 'A digital illustration blending traditional Indian mythology with cyberpunk aesthetics. Lord Shiva reimagined in a neon-lit metropolis.',
        category: 'Digital Art',
        imageUrl: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=600&q=80',
        artistId: 'user-sample-2',
        artistName: 'Priya Sharma',
        likes: 287,
        views: 3540,
        createdAt: '2026-01-20T14:30:00'
    },
    {
        id: 'art-3',
        title: 'The Potter\'s Hands',
        description: 'A close-up photograph of a master potter at work in Khurja. The wrinkled hands tell a story of decades of devotion to craft.',
        category: 'Photography',
        imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
        artistId: 'user-sample-3',
        artistName: 'Ravi Kapoor',
        likes: 95,
        views: 1200,
        createdAt: '2026-01-22T09:15:00'
    },
    {
        id: 'art-4',
        title: 'Urban Geometry',
        description: 'Abstract sculpture exploring the tension between organic forms and rigid urban architecture. Made from recycled steel and copper.',
        category: 'Sculpture',
        imageUrl: 'https://images.unsplash.com/photo-1561214078-f3247647FC5E?w=600&q=80',
        artistId: 'user-sample-4',
        artistName: 'Kavya Nair',
        likes: 56,
        views: 780,
        createdAt: '2026-01-25T16:45:00'
    },
    {
        id: 'art-5',
        title: 'Silent Raga',
        description: 'Watercolor on handmade paper depicting a veena player lost in meditation. The colors flow like music itself.',
        category: 'Painting',
        imageUrl: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80',
        artistId: 'user-sample-1',
        artistName: 'Arjun Mehta',
        likes: 203,
        views: 2100,
        createdAt: '2026-01-28T11:00:00'
    },
    {
        id: 'art-6',
        title: 'Frame by Frame',
        description: 'Behind-the-scenes stills from an independent short film shot in Old Delhi. Each frame tells a different story.',
        category: 'Film',
        imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80',
        artistId: 'user-sample-5',
        artistName: 'Vikram Singh',
        likes: 178,
        views: 2650,
        createdAt: '2026-01-30T08:00:00'
    },
    {
        id: 'art-7',
        title: 'Marble Dreams',
        description: 'A contemporary marble sculpture inspired by classical Indian temple carvings, reinterpreted with modern minimalist lines.',
        category: 'Sculpture',
        imageUrl: 'https://images.unsplash.com/photo-1544413164-5f5e2d8d7e4b?w=600&q=80',
        artistId: 'user-sample-4',
        artistName: 'Kavya Nair',
        likes: 89,
        views: 920,
        createdAt: '2026-02-01T13:20:00'
    },
    {
        id: 'art-8',
        title: 'Digital Mandala',
        description: 'Generative art piece created with code. Each iteration produces a unique mandala pattern based on mathematical algorithms.',
        category: 'Digital Art',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
        artistId: 'user-sample-2',
        artistName: 'Priya Sharma',
        likes: 312,
        views: 4100,
        createdAt: '2026-02-05T10:30:00'
    },
    {
        id: 'art-9',
        title: 'Street Theatre',
        description: 'Documentary photography series capturing the vibrant street performances during the Kala Ghoda Arts Festival.',
        category: 'Photography',
        imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80',
        artistId: 'user-sample-3',
        artistName: 'Ravi Kapoor',
        likes: 145,
        views: 1670,
        createdAt: '2026-02-10T15:00:00'
    }
];

const SAMPLE_ARTISTS = [
    {
        id: 'user-sample-1',
        name: 'Arjun Mehta',
        email: 'arjun@example.com',
        role: 'Painter & Muralist',
        bio: 'Contemporary painter blending traditional Indian art forms with modern expressionism. Works exhibited across 12 countries.',
        skills: ['Oil Painting', 'Watercolor', 'Mural Art', 'Mixed Media'],
        artworks: 24,
        connections: 156
    },
    {
        id: 'user-sample-2',
        name: 'Priya Sharma',
        email: 'priya@example.com',
        role: 'Digital Artist & UI Designer',
        bio: 'Pushing the boundaries of digital art with cultural narratives. Featured in Adobe Creative Spotlight 2025.',
        skills: ['Digital Illustration', 'Generative Art', 'Motion Graphics', 'UI Design'],
        artworks: 38,
        connections: 289
    },
    {
        id: 'user-sample-3',
        name: 'Ravi Kapoor',
        email: 'ravi@example.com',
        role: 'Photographer',
        bio: 'Documentary and street photographer capturing the soul of Indian streets. National Geographic contributor.',
        skills: ['Street Photography', 'Documentary', 'Portrait', 'Photo Editing'],
        artworks: 67,
        connections: 312
    },
    {
        id: 'user-sample-4',
        name: 'Kavya Nair',
        email: 'kavya@example.com',
        role: 'Sculptor & Installation Artist',
        bio: 'Creates large-scale installations that challenge perspectives on urban living and sustainability.',
        skills: ['Marble Sculpture', 'Steel Work', 'Installation Art', 'Ceramics'],
        artworks: 15,
        connections: 98
    },
    {
        id: 'user-sample-5',
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        role: 'Film Director & Screenwriter',
        bio: 'Independent filmmaker with 3 award-winning short films. Looking for talented actors and cinematographers to collaborate.',
        skills: ['Direction', 'Screenwriting', 'Cinematography', 'Editing'],
        artworks: 8,
        connections: 204
    }
];

const CATEGORIES = ['All', 'Painting', 'Digital Art', 'Photography', 'Sculpture', 'Film', 'Music', 'Dance', 'Theatre'];

// ---- State Management ----
const AppState = {
    currentUser: null,
    currentPage: 'feed',
    artworks: [],
    likedArtworks: new Set(),
    connectedArtists: new Set(),
};

// ---- LocalStorage Helpers ----
function saveToStorage(key, value) {
    localStorage.setItem(`artisan_hub_${key}`, JSON.stringify(value));
}

function loadFromStorage(key) {
    const data = localStorage.getItem(`artisan_hub_${key}`);
    return data ? JSON.parse(data) : null;
}

function initializeData() {
    // Load artworks. If none in storage, seed with samples
    let storedArtworks = loadFromStorage('artworks');
    if (!storedArtworks || storedArtworks.length === 0) {
        saveToStorage('artworks', SAMPLE_ARTWORKS);
        storedArtworks = SAMPLE_ARTWORKS;
    }
    AppState.artworks = storedArtworks;

    // Load artists. If none in storage, seed with samples
    let storedArtists = loadFromStorage('artists');
    if (!storedArtists || storedArtists.length === 0) {
        saveToStorage('artists', SAMPLE_ARTISTS);
    }

    // Load liked artworks
    const liked = loadFromStorage('liked');
    if (liked) AppState.likedArtworks = new Set(liked);

    // Load connections
    const connected = loadFromStorage('connected');
    if (connected) AppState.connectedArtists = new Set(connected);
}

// ---- Auth Functions ----
function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const role = document.getElementById('signup-role').value;

    if (!name || !email || !password) {
        showToast('Please fill in all fields', 'fa-exclamation-circle');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'fa-exclamation-circle');
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'fa-exclamation-circle');
        return;
    }

    // Check if already registered
    const users = loadFromStorage('users') || [];
    if (users.find(u => u.email === email)) {
        showToast('Email already registered. Please login.', 'fa-exclamation-circle');
        return;
    }

    const newUser = {
        id: 'user-' + Date.now(),
        name,
        email,
        password,
        role: role || 'Artist',
        bio: '',
        skills: [],
        artworks: 0,
        connections: 0,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveToStorage('users', users);

    // Auto-login
    AppState.currentUser = newUser;
    saveToStorage('currentUser', newUser);

    showToast(`Welcome to Artisan Hub, ${name}! 🎨`, 'fa-check-circle');
    transitionToApp();
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showToast('Please enter your credentials', 'fa-exclamation-circle');
        return;
    }

    const users = loadFromStorage('users') || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showToast('Invalid email or password', 'fa-exclamation-circle');
        return;
    }

    AppState.currentUser = user;
    saveToStorage('currentUser', user);
    showToast(`Welcome back, ${user.name}!`, 'fa-check-circle');
    transitionToApp();
}

function handleLogout() {
    AppState.currentUser = null;
    localStorage.removeItem('artisan_hub_currentUser');
    // Show auth page
    const authPage = document.getElementById('auth-page');
    const appContainer = document.getElementById('app-container');
    appContainer.classList.remove('active');
    setTimeout(() => {
        authPage.classList.remove('hidden');
    }, 300);
}

function checkExistingSession() {
    const user = loadFromStorage('currentUser');
    if (user) {
        AppState.currentUser = user;
        transitionToApp(true);
    }
}

function transitionToApp(instant = false) {
    const authPage = document.getElementById('auth-page');
    const appContainer = document.getElementById('app-container');

    if (instant) {
        authPage.style.display = 'none';
        appContainer.classList.add('active');
    } else {
        authPage.classList.add('hidden');
        setTimeout(() => {
            authPage.style.display = 'none';
            appContainer.classList.add('active');
        }, 800);
    }

    renderApp();
}

// ---- Toggle Login / Signup ----
function showSignupPanel() {
    document.getElementById('login-panel').classList.add('hidden');
    document.getElementById('signup-panel').classList.remove('hidden');
}

function showLoginPanel() {
    document.getElementById('signup-panel').classList.add('hidden');
    document.getElementById('login-panel').classList.remove('hidden');
}

// ---- Render Functions ----
function renderApp() {
    updateNavbar();
    renderFeed();
    renderConnectPage();
    renderProfilePage();
    navigateTo(AppState.currentPage);
}

function updateNavbar() {
    const user = AppState.currentUser;
    if (!user) return;
    const avatarEls = document.querySelectorAll('.user-avatar-initial');
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    avatarEls.forEach(el => el.textContent = initials);
}

// ---- Navigation ----
function navigateTo(page) {
    AppState.currentPage = page;

    // Update active nav links
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });

    // Show/hide page sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.toggle('active', section.id === `page-${page}`);
    });

    // Re-render page content if needed
    if (page === 'feed') renderFeed();
    if (page === 'connect') renderConnectPage();
    if (page === 'profile') renderProfilePage();

    // Show/hide FAB
    const fab = document.getElementById('fab');
    if (fab) fab.style.display = page === 'upload' ? 'none' : 'flex';
}

// ---- FEED RENDERING ----
function renderFeed(filterCategory = 'All') {
    const grid = document.getElementById('feed-grid');
    if (!grid) return;

    const artworks = AppState.artworks.filter(art => {
        if (filterCategory === 'All') return true;
        return art.category === filterCategory;
    });

    if (artworks.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-palette"></i>
                <h3>No artworks yet</h3>
                <p>Be the first to share your masterpiece!</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = artworks.map(art => {
        const isLiked = AppState.likedArtworks.has(art.id);
        const initials = art.artistName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        return `
            <div class="artwork-card" onclick="openArtworkModal('${art.id}')">
                <div class="artwork-image-wrapper">
                    <img src="${art.imageUrl}" alt="${art.title}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%231f2937%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%234b5563%22 font-family=%22sans-serif%22 font-size=%2216%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage unavailable%3C/text%3E%3C/svg%3E'">
                    <div class="artwork-overlay">
                        <div class="artwork-overlay-actions">
                            <button class="overlay-btn ${isLiked ? 'liked' : ''}" onclick="event.stopPropagation(); toggleLike('${art.id}')" title="Like">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="overlay-btn" onclick="event.stopPropagation(); showToast('Saved to collection!', 'fa-bookmark')" title="Save">
                                <i class="fas fa-bookmark"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="artwork-info">
                    <h3>${art.title}</h3>
                    <div class="artwork-artist">
                        <div class="artwork-artist-avatar">${initials}</div>
                        <span class="artwork-artist-name">${art.artistName}</span>
                    </div>
                    <span class="artwork-category-tag">${art.category}</span>
                </div>
                <div class="artwork-stats">
                    <span class="artwork-stat"><i class="fas fa-heart"></i> ${art.likes + (isLiked ? 1 : 0)}</span>
                    <span class="artwork-stat"><i class="fas fa-eye"></i> ${art.views}</span>
                </div>
            </div>
        `;
    }).join('');
}

function toggleLike(artworkId) {
    if (AppState.likedArtworks.has(artworkId)) {
        AppState.likedArtworks.delete(artworkId);
    } else {
        AppState.likedArtworks.add(artworkId);
    }
    saveToStorage('liked', [...AppState.likedArtworks]);
    renderFeed(document.querySelector('.pill.active')?.dataset?.category || 'All');
}

function filterFeed(category, pill) {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    renderFeed(category);
}

// ---- ARTWORK MODAL ----
function openArtworkModal(artworkId) {
    const art = AppState.artworks.find(a => a.id === artworkId);
    if (!art) return;

    const modal = document.getElementById('artwork-modal');
    const initials = art.artistName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const isLiked = AppState.likedArtworks.has(art.id);

    document.getElementById('modal-image').src = art.imageUrl;
    document.getElementById('modal-image').alt = art.title;
    document.getElementById('modal-title').textContent = art.title;
    document.getElementById('modal-description').textContent = art.description;
    document.getElementById('modal-artist-initials').textContent = initials;
    document.getElementById('modal-artist-name').textContent = art.artistName;
    document.getElementById('modal-category').textContent = art.category;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeArtworkModal() {
    const modal = document.getElementById('artwork-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ---- UPLOAD HANDLING ----
let uploadedImageData = null;

function initUpload() {
    const dropZone = document.getElementById('upload-drop-zone');
    const fileInput = document.getElementById('upload-file-input');

    if (!dropZone || !fileInput) return;

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageFile(file);
        }
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleImageFile(file);
    });
}

function handleImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedImageData = e.target.result;
        const preview = document.getElementById('upload-preview');
        const previewImg = document.getElementById('upload-preview-img');
        previewImg.src = uploadedImageData;
        preview.classList.add('active');
        document.getElementById('upload-drop-zone').style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function removeUploadPreview() {
    uploadedImageData = null;
    document.getElementById('upload-preview').classList.remove('active');
    document.getElementById('upload-drop-zone').style.display = '';
    document.getElementById('upload-file-input').value = '';
}

function handleUploadSubmit(e) {
    e.preventDefault();

    if (!uploadedImageData) {
        showToast('Please select an image to upload', 'fa-exclamation-circle');
        return;
    }

    const title = document.getElementById('upload-title').value.trim();
    const description = document.getElementById('upload-description').value.trim();
    const category = document.getElementById('upload-category').value;

    if (!title) {
        showToast('Please enter a title for your artwork', 'fa-exclamation-circle');
        return;
    }

    const newArtwork = {
        id: 'art-' + Date.now(),
        title,
        description: description || 'No description provided.',
        category,
        imageUrl: uploadedImageData,
        artistId: AppState.currentUser.id,
        artistName: AppState.currentUser.name,
        likes: 0,
        views: 0,
        createdAt: new Date().toISOString()
    };

    AppState.artworks.unshift(newArtwork);
    saveToStorage('artworks', AppState.artworks);

    // Reset form
    e.target.reset();
    removeUploadPreview();

    showToast('Artwork published successfully! 🎉', 'fa-check-circle');
    navigateTo('feed');
}

// ---- CONNECT / ARTISTS PAGE ----
function renderConnectPage() {
    const grid = document.getElementById('artists-grid');
    if (!grid) return;

    const artists = loadFromStorage('artists') || SAMPLE_ARTISTS;

    grid.innerHTML = artists.map(artist => {
        const initials = artist.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const isConnected = AppState.connectedArtists.has(artist.id);
        const isSelf = AppState.currentUser && artist.id === AppState.currentUser.id;

        return `
            <div class="artist-card">
                <div class="artist-card-cover"></div>
                <div class="artist-card-body">
                    <div class="artist-card-avatar">${initials}</div>
                    <div class="artist-card-name">${artist.name}</div>
                    <div class="artist-card-role">${artist.role}</div>
                    <div class="artist-card-bio">${artist.bio}</div>
                    <div class="artist-card-footer">
                        ${isSelf ? '<button class="btn-connect connected" disabled>You</button>' :
                `<button class="btn-connect ${isConnected ? 'connected' : ''}" onclick="toggleConnect('${artist.id}', this)">
                            ${isConnected ? '✓ Connected' : 'Connect'}
                        </button>
                        <button class="btn-message" onclick="showToast('Message feature coming soon!', 'fa-envelope')">
                            <i class="fas fa-envelope"></i>
                        </button>`}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function toggleConnect(artistId, btn) {
    if (AppState.connectedArtists.has(artistId)) {
        AppState.connectedArtists.delete(artistId);
        btn.classList.remove('connected');
        btn.textContent = 'Connect';
        showToast('Connection removed', 'fa-user-minus');
    } else {
        AppState.connectedArtists.add(artistId);
        btn.classList.add('connected');
        btn.textContent = '✓ Connected';
        showToast('Connection request sent! 🤝', 'fa-user-plus');
    }
    saveToStorage('connected', [...AppState.connectedArtists]);
}

// ---- PROFILE PAGE ----
function renderProfilePage() {
    const user = AppState.currentUser;
    if (!user) return;

    // Profile header
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const profileAvatar = document.getElementById('profile-avatar');
    if (profileAvatar) profileAvatar.textContent = initials;

    const profileName = document.getElementById('profile-name');
    if (profileName) profileName.textContent = user.name;

    const profileRole = document.getElementById('profile-role');
    if (profileRole) profileRole.textContent = user.role || 'Artist';

    // Stats
    const userArtworks = AppState.artworks.filter(a => a.artistId === user.id);
    const artworkCount = document.getElementById('profile-artwork-count');
    if (artworkCount) artworkCount.textContent = userArtworks.length;

    const connectionCount = document.getElementById('profile-connection-count');
    if (connectionCount) connectionCount.textContent = AppState.connectedArtists.size;

    // Bio
    const profileBio = document.getElementById('profile-bio');
    if (profileBio) profileBio.textContent = user.bio || 'No bio yet. Tell the world about your art journey!';

    // Skills
    const skillsContainer = document.getElementById('profile-skills');
    if (skillsContainer) {
        const skills = user.skills && user.skills.length > 0 ? user.skills : ['Art', 'Creativity'];
        skillsContainer.innerHTML = skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
    }

    // Works grid
    const worksGrid = document.getElementById('profile-works-grid');
    if (worksGrid) {
        if (userArtworks.length === 0) {
            worksGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-image"></i>
                    <h3>No artworks yet</h3>
                    <p>Start sharing your creative works!</p>
                </div>
            `;
        } else {
            worksGrid.innerHTML = userArtworks.map(art => `
                <div class="profile-work-item" onclick="openArtworkModal('${art.id}')">
                    <img src="${art.imageUrl}" alt="${art.title}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 300%22%3E%3Crect fill=%22%231f2937%22 width=%22300%22 height=%22300%22/%3E%3Ctext fill=%22%234b5563%22 font-family=%22sans-serif%22 font-size=%2214%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3ENo image%3C/text%3E%3C/svg%3E'">
                </div>
            `).join('');
        }
    }
}

// ---- TOAST NOTIFICATIONS ----
function showToast(message, icon = 'fa-check-circle') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ---- BACKGROUND SLIDESHOW ----
function initBackgroundSlideshow() {
    const backgrounds = ['background1.avif', 'background2.jpg'];
    const slides = document.querySelectorAll('.bg-slide');
    if (slides.length === 0) return;

    let currentSlideIndex = 0;

    slides[0].style.backgroundImage = `url('${backgrounds[0]}')`;
    slides[0].classList.add('active');

    setInterval(() => {
        const nextIndex = (currentSlideIndex + 1) % slides.length;
        const nextImageIndex = (currentSlideIndex + 1) % backgrounds.length;
        slides[nextIndex].style.backgroundImage = `url('${backgrounds[nextImageIndex]}')`;
        slides[currentSlideIndex].classList.remove('active');
        slides[nextIndex].classList.add('active');
        currentSlideIndex = nextIndex;
    }, 7000);
}

// ---- 3D TILT EFFECT (Auth Card) ----
function initTiltEffect() {
    const card = document.querySelector('.auth-card');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const rotateX = (height / 2 - y) / (height / 2) * -4;
        const rotateY = (width / 2 - x) / (width / 2) * 4;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
}

// ---- SPOTLIGHT MOUSE FOLLOW ----
function initSpotlight() {
    const spotlight = document.querySelector('.spotlight-overlay');
    if (!spotlight) return;

    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth * 100).toFixed(1);
        const y = (e.clientY / window.innerHeight * 100).toFixed(1);
        spotlight.style.setProperty('--mouse-x', `${x}%`);
        spotlight.style.setProperty('--mouse-y', `${y}%`);
    });
}

// ---- GREETING ----
function setGreeting() {
    const el = document.getElementById('auth-greeting');
    if (!el) return;
    const hour = new Date().getHours();
    if (hour < 12) el.textContent = 'Good Morning';
    else if (hour < 18) el.textContent = 'Good Afternoon';
    else el.textContent = 'Good Evening';
}

// ---- USER DROPDOWN ----
function initUserDropdown() {
    const avatar = document.getElementById('navbar-avatar');
    const dropdown = document.getElementById('user-dropdown');
    if (!avatar || !dropdown) return;

    avatar.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        dropdown.classList.remove('show');
    });
}

// ---- SEARCH ----
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (AppState.currentPage === 'feed') {
            const grid = document.getElementById('feed-grid');
            const filtered = AppState.artworks.filter(art =>
                art.title.toLowerCase().includes(query) ||
                art.artistName.toLowerCase().includes(query) ||
                art.category.toLowerCase().includes(query)
            );
            // Re-render with filtered results
            if (query === '') {
                renderFeed();
            } else {
                renderFilteredFeed(filtered);
            }
        }
    });
}

function renderFilteredFeed(artworks) {
    const grid = document.getElementById('feed-grid');
    if (!grid) return;

    if (artworks.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-search"></i>
                <h3>No results found</h3>
                <p>Try a different search term</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = artworks.map(art => {
        const isLiked = AppState.likedArtworks.has(art.id);
        const initials = art.artistName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        return `
            <div class="artwork-card" onclick="openArtworkModal('${art.id}')">
                <div class="artwork-image-wrapper">
                    <img src="${art.imageUrl}" alt="${art.title}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%231f2937%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%234b5563%22 font-family=%22sans-serif%22 font-size=%2216%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage unavailable%3C/text%3E%3C/svg%3E'">
                    <div class="artwork-overlay">
                        <div class="artwork-overlay-actions">
                            <button class="overlay-btn ${isLiked ? 'liked' : ''}" onclick="event.stopPropagation(); toggleLike('${art.id}')" title="Like">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="artwork-info">
                    <h3>${art.title}</h3>
                    <div class="artwork-artist">
                        <div class="artwork-artist-avatar">${initials}</div>
                        <span class="artwork-artist-name">${art.artistName}</span>
                    </div>
                    <span class="artwork-category-tag">${art.category}</span>
                </div>
                <div class="artwork-stats">
                    <span class="artwork-stat"><i class="fas fa-heart"></i> ${art.likes + (isLiked ? 1 : 0)}</span>
                    <span class="artwork-stat"><i class="fas fa-eye"></i> ${art.views}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ---- INITIALIZATION ----
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    setGreeting();
    initBackgroundSlideshow();
    initTiltEffect();
    initSpotlight();
    initUpload();
    initUserDropdown();
    initSearch();

    // Auth form listeners
    const loginForm = document.getElementById('login-form-el');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const signupForm = document.getElementById('signup-form-el');
    if (signupForm) signupForm.addEventListener('submit', handleSignup);

    // Navigation listeners (desktop)
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });

    // Navigation listeners (mobile)
    document.querySelectorAll('.mobile-nav-link[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });

    // Upload form
    const uploadForm = document.getElementById('upload-form-el');
    if (uploadForm) uploadForm.addEventListener('submit', handleUploadSubmit);

    // Modal close
    const modalOverlay = document.getElementById('artwork-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeArtworkModal();
        });
    }

    // Escape key for modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeArtworkModal();
    });

    // Check existing session
    checkExistingSession();
});
