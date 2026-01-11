document.addEventListener("DOMContentLoaded", () => {
  // 1. Thumbnail Grid Logic
  const workGrid = document.getElementById("work-grid");
  const loadMoreBtn = document.getElementById("load-more-btn");
  // To add more images, simply add the filenames to this array
  const MOCK_THUMBNAILS = [
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "6.jpg",
    "7.jpg",
    "8.jpg",
    "9.jpg",
    "10.jpg",
    "11.jpg",
    "12.jpg",
    "13.jpg",
    "14.jpg",
    "15.jpg",
    "16.jpg",
    "17.jpg",
    "18.png",
    "19.png",
    "20.png",
    "21.jpg",
    "22.jpg",
    "23.jpg",
    "24.jpg",
    "25.jpg",
    "26.jpg",
    "27.jpg",
    "28.jpg",
    "29.jpg",
    "30.jpg",
    "31.jpg",
    "32.jpg",
    "33.jpg",
  ];

  const ITEMS_PER_PAGE = 6;
  let currentPage = 0;

  function loadWorkItems() {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const itemsToLoad = MOCK_THUMBNAILS.slice(startIndex, endIndex);

    itemsToLoad.forEach((src) => {
      const el = document.createElement("div");
      el.className = "work-item";
      el.innerHTML = `<img src="/${src}" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/1280x720/000000/FFF?text=Image+Error'">`;
      workGrid.appendChild(el);
    });

    currentPage++;

    if (currentPage * ITEMS_PER_PAGE >= MOCK_THUMBNAILS.length) {
      loadMoreBtn.style.display = "none";
    }
  }

  if (workGrid && loadMoreBtn) {
    if (MOCK_THUMBNAILS.length > 0) {
      loadWorkItems();
      loadMoreBtn.addEventListener("click", loadWorkItems);
    } else {
      workGrid.innerHTML = `<p class="text-slate-500 dark:text-slate-400 font-walter text-center col-span-full">No images to display.</p>`;
      loadMoreBtn.style.display = "none";
    }
  }

  // 2. Reviews Logic
  const reviewsContainer = document.getElementById("reviews-container");
  const MOCK_REVIEWS = [
    {
      name: "Crxyon_",
      text: "High-quality thumbnail delivered within a short time frame. Great attention to detail and overall finish.",
      stars: 5,
      pfp: "/crayon.png",
    },
    {
      name: "ZeorPlayzX",
      text: "Extremely professional design with eye-catching colors and perfect text placement. The video vibe was crystal clear.",
      stars: 5,
      pfp: "/zayor.png",
    },
    {
      name: "Craftopia Conqueror",
      text: "Outstanding thumbnail quality with very fast delivery. One of the best thumbnail creators I’ve seen.",
      stars: 5,
      pfp: "/craftopia.png",
    },
    {
      name: "MrScaft",
      text: "Creative and impressive work that clearly stands out. Loved the final result.",
      stars: 5,
      pfp: "/mrscaft.png",
    },
    {
      name: "SAMAR YT",
      text: "Quick delivery with excellent animation quality. Strong teamwork and solid execution.",
      stars: 5,
      pfp: "/samar.png",
    },
  ];

  if (reviewsContainer) {
    reviewsContainer.innerHTML = "";
    MOCK_REVIEWS.forEach((r) => {
      const card = document.createElement("div");
      card.className = "review-slide";
      const pfpHtml = r.pfp
        ? `<img src="${r.pfp}" class="w-10 h-10 rounded-full object-cover shadow-lg flex-shrink-0">`
        : `<div class="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">${r.name.charAt(0)}</div>`;

      card.innerHTML = `
                <div class="flex items-center gap-3 mb-4">
                    ${pfpHtml}
                    <div>
                        <h4 class="font-bold text-base text-text-primary">${r.name}</h4>
                        <div class="flex text-yellow-400 text-xs">${"★".repeat(r.stars || 5)}</div>
                    </div>
                </div>
                <p class="text-sm text-text-secondary leading-relaxed font-medium">"${r.text}"</p>
            `;
      reviewsContainer.appendChild(card);
    });
    if (window.initReviewLogic) window.initReviewLogic();
  }

  // Initialize other functionalities
  lucide.createIcons();
  setTimeout(typeWriter, 300);
  initThemeToggle();
  initReviewSlider();
  initTiltEffect();
  initModal();
  initScrollSpy();
});

// Splash Screen Logic
const textToType = "NomanPlayzz...";
const typingElement = document.getElementById("typing-text");
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
  const splash = document.getElementById("splash-screen");
  if (splash) splash.classList.add("loaded");
  document.body.classList.remove("overflow-hidden");
  setTimeout(initScrollObserver, 100);
}

// Fallback to finish loading
setTimeout(() => {
  const splash = document.getElementById("splash-screen");
  if (splash && !splash.classList.contains("loaded")) {
    finishLoading();
  }
}, 3000);

// Scroll Observer for animations
function initScrollObserver() {
  const observerOptions = { threshold: 0.15, rootMargin: "0px" };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, observerOptions);
  document
    .querySelectorAll(".reveal-on-scroll")
    .forEach((el) => observer.observe(el));
}

// Theme Toggle
function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  const html = document.documentElement;

  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }

  toggleBtn.addEventListener("click", () => {
    html.classList.toggle("dark");
    localStorage.theme = html.classList.contains("dark") ? "dark" : "light";
  });
}

// Review Carousel
function initReviewSlider() {
  let reviewItems = document.querySelectorAll(".review-slide");
  let currentReviewIndex = 0;
  if (reviewItems.length === 0) return;

  function updateReviewClasses() {
    reviewItems.forEach((item, index) => {
      item.classList.remove("active");
      item.style.opacity = "0";
      item.style.pointerEvents = "none";
      item.style.transform = "translateX(0) scale(0.95)";

      if (index === currentReviewIndex) {
        item.classList.add("active");
        item.style.opacity = "1";
        item.style.pointerEvents = "auto";
        item.style.transform = "translateX(0) scale(1)";
      }
    });
  }

  window.moveReview = (direction) => {
    currentReviewIndex =
      (currentReviewIndex + direction + reviewItems.length) %
      reviewItems.length;
    updateReviewClasses();
  };

  updateReviewClasses();
}

// Tilt Effect
function initTiltEffect() {
  if (window.innerWidth > 768) {
    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xRot = (y / rect.height - 0.5) * 8;
        const yRot = (x / rect.width - 0.5) * -8;
        card.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale(1.01)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform =
          "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
      });
    });
  }
}

// Modal Logic
function initModal() {
  const modal = document.getElementById("contact-modal");
  const modalPanel = modal.querySelector(".modal-panel");
  document.querySelectorAll(".contact-trigger").forEach((t) =>
    t.addEventListener("click", () => {
      modal.classList.remove("opacity-0", "pointer-events-none");
      modalPanel.classList.remove("scale-95");
    }),
  );
  document.getElementById("close-modal").addEventListener("click", () => {
    modal.classList.add("opacity-0", "pointer-events-none");
    modalPanel.classList.add("scale-95");
  });
  document.querySelectorAll(".copy-item").forEach((item) => {
    item.addEventListener("click", () => {
      navigator.clipboard.writeText(item.dataset.copy);
      const toast = document.getElementById("toast");
      toast.classList.remove("opacity-0");
      setTimeout(() => toast.classList.add("opacity-0"), 2000);
    });
  });
}

// Scroll Spy for active nav link
function initScrollSpy() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
  });
}
