import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD6DTINNifgEuReilo6hGKlpZYsFgUl91Y",
    authDomain: "itszeronfx.firebaseapp.com",
    databaseURL: "https://itszeronfx-default-rtdb.firebaseio.com",
    projectId: "itszeronfx",
    storageBucket: "itszeronfx.firebasestorage.app",
    messagingSenderId: "632344070704",
    appId: "1:632344070704:web:a836fc3d7084cd28a9fbf5"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function getDirectLink(url) {
    if (!url) return '';
    const driveRegex = /\/file\/d\/([a-zA-Z0-9_-]+)\//;
    const match = url.match(driveRegex);
    if (match && match[1]) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    return url;
}

// 1. Thumbnails Logic
const thumbnailsRef = ref(database, 'thumbnails');
onValue(thumbnailsRef, (snapshot) => {
    const carouselContainer = document.getElementById('carousel-container');
    carouselContainer.innerHTML = '';
    const data = snapshot.val();
    let works = [];

    if (data) {
        Object.values(data).forEach(item => {
            const link = typeof item === 'object' ? item.imageUrl : item;
            if (link) works.push(getDirectLink(link));
        });
    }

    if (works.length === 0) {
        works = [
            "https://placehold.co/1280x720/00A3FF/ffffff?text=Add+Images+to+DB",
            "https://placehold.co/1280x720/0F1724/00A3FF?text=Firebase+RTDB",
            "https://placehold.co/1280x720/020617/60C2FF?text=Configured"
        ];
    }

    works.forEach(src => {
        const el = document.createElement('div');
        el.className = 'carousel-item';
        el.innerHTML = `<img src="${src}" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/1280x720/000000/FFF?text=Image+Error'">`;
        carouselContainer.appendChild(el);
    });

    if (window.initCarouselLogic) window.initCarouselLogic();
});

// 2. Reviews Logic (SLIDER)
const reviewsRef = ref(database, 'reviews');
onValue(reviewsRef, (snapshot) => {
    const reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.innerHTML = '';
    const data = snapshot.val();

    let reviews = [];
    if (data) {
        reviews = Object.values(data);
    } else {
        // Dummy Reviews
        reviews = [
            { name: "Alex K.", text: "Noman totally transformed my channel art. CTR went up by 20% in a week!", stars: 5, pfp: "" },
            { name: "CraftyMike", text: "Fastest delivery I've ever seen for this quality. Highly recommended.", stars: 5, pfp: "" },
            { name: "SarahDev", text: "Super chill to work with and understood exactly what I needed.", stars: 5, pfp: "" }
        ];
    }

    reviews.forEach(r => {
        const card = document.createElement('div');
        card.className = 'review-slide';
        // Use provided PFP or fallback to initial
        const pfpHtml = r.pfp
            ? `<img src="${r.pfp}" class="w-10 h-10 rounded-full object-cover shadow-lg flex-shrink-0">`
            : `<div class="w-10 h-10 bg-brand-DEFAULT rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">${r.name.charAt(0)}</div>`;

        card.innerHTML = `
                    <div class="flex items-center gap-3 mb-4">
                        ${pfpHtml}
                        <div>
                            <h4 class="font-bold text-base text-slate-900 dark:text-white">${r.name}</h4>
                            <div class="flex text-yellow-400 text-xs">${'★'.repeat(r.stars || 5)}</div>
                        </div>
                    </div>
                    <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">"${r.text}"</p>
                `;
        reviewsContainer.appendChild(card);
    });

    if (window.initReviewLogic) window.initReviewLogic();
});

lucide.createIcons();

// 1. ROBUST LOADING LOGIC
const textToType = "Noman...";
const typingElement = document.getElementById('typing-text');
let charIndex = 0;

function typeWriter() {
    if (!typingElement) return;

    if (charIndex < textToType.length) {
        typingElement.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 120);
    } else {
        finishLoading();
    }
}

function finishLoading() {
    const splash = document.getElementById('splash-screen');
    if (splash) splash.classList.add('loaded');
    document.body.classList.remove('overflow-hidden');
    setTimeout(initScrollObserver, 100);
}

document.addEventListener('DOMContentLoaded', () => { setTimeout(typeWriter, 300); });
setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash && !splash.classList.contains('loaded')) {
        finishLoading();
    }
}, 3000);

// 2. SCROLL OBSERVER
function initScrollObserver() {
    const observerOptions = { threshold: 0.15, rootMargin: "0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
            else entry.target.classList.remove('is-visible');
        });
    }, observerOptions);
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

// 3. THEME TOGGLE
const toggleBtn = document.getElementById('theme-toggle');
const html = document.documentElement;
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

toggleBtn.addEventListener('click', () => {
    html.classList.toggle('dark');
    if (html.classList.contains('dark')) {
        localStorage.theme = 'dark';
    } else {
        localStorage.theme = 'light';
    }
});

// 4. WORK CAROUSEL
let carouselInterval;
let items;
let currentItemIndex = 2;

window.initCarouselLogic = function () {
    items = document.querySelectorAll('.carousel-item');
    if (items.length === 0) return;
    if (currentItemIndex >= items.length) currentItemIndex = 0;

    function updateCarouselClasses() {
        items.forEach((item, index) => {
            item.classList.remove('item-center', 'item-right', 'item-left', 'item-hidden');
            if (index === currentItemIndex) item.classList.add('item-center');
            else if (index === (currentItemIndex + 1) % items.length) item.classList.add('item-right');
            else if (index === (currentItemIndex - 1 + items.length) % items.length) item.classList.add('item-left');
            else item.classList.add('item-hidden');
        });
    }

    window.moveCarousel = function (direction) {
        currentItemIndex = (currentItemIndex + direction + items.length) % items.length;
        updateCarouselClasses();
    }

    function startAutoplay() {
        if (carouselInterval) clearInterval(carouselInterval);
        carouselInterval = setInterval(() => moveCarousel(1), 3000);
    }
    function stopAutoplay() { clearInterval(carouselInterval); }

    const container = document.getElementById('carousel-container');
    if (container) {
        container.removeEventListener('mouseenter', stopAutoplay);
        container.removeEventListener('mouseleave', startAutoplay);
        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', startAutoplay);
    }

    updateCarouselClasses();
    startAutoplay();
};

// 5. REVIEW CAROUSEL
let reviewItems;
let currentReviewIndex = 0;

window.initReviewLogic = function () {
    reviewItems = document.querySelectorAll('.review-slide');
    if (reviewItems.length === 0) return;

    function updateReviewClasses() {
        reviewItems.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next');
            item.style.opacity = '0';
            item.style.pointerEvents = 'none';
            item.style.transform = 'translateX(100%) scale(0.9)'; // Reset transform

            if (index === currentReviewIndex) {
                item.classList.add('active');
                item.style.opacity = '1';
                item.style.pointerEvents = 'auto';
                item.style.transform = 'translateX(0) scale(1)';
            }
        });
    }

    window.moveReview = function (direction) {
        currentReviewIndex = (currentReviewIndex + direction + reviewItems.length) % reviewItems.length;
        updateReviewClasses();
    }

    // Force first item to be active immediately
    if (reviewItems.length > 0) {
        currentReviewIndex = 0;
        updateReviewClasses();
    }
};

// 6. TILT & MODAL
if (window.innerWidth > 768) {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; const y = e.clientY - rect.top;
            const xRot = ((y / rect.height) - 0.5) * 8; const yRot = ((x / rect.width) - 0.5) * -8;
            card.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale(1.01)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'; });
    });
}

const modal = document.getElementById('contact-modal');
const modalPanel = modal.querySelector('.modal-panel');
document.querySelectorAll('.contact-trigger').forEach(t => t.addEventListener('click', () => {
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modalPanel.classList.remove('scale-95'); modalPanel.classList.add('scale-100');
}));
document.getElementById('close-modal').addEventListener('click', () => {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modalPanel.classList.add('scale-95'); modalPanel.classList.remove('scale-100');
});
document.querySelectorAll('.copy-item').forEach(item => {
    item.addEventListener('click', () => {
        navigator.clipboard.writeText(item.dataset.copy);
        document.getElementById('toast').classList.remove('opacity-0');
        setTimeout(() => document.getElementById('toast').classList.add('opacity-0'), 2000);
    });
});

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 150) current = section.getAttribute('id');
    });
    navLinks.forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('href').includes(current)) li.classList.add('active');
    });
});