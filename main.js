
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