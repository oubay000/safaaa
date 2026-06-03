/* ===================================
   SCRIPT.JS - Love Page for Safaa
   =================================== */

// ---- CONFIG ----
// Compressed thumbnails for fast loading
const PHOTOS_THUMB = [
    'photos/thumbs/IMG_8630.jpg',
    'photos/thumbs/IMG_8631.jpg',
    'photos/thumbs/IMG_8632.jpg',
    'photos/thumbs/IMG_8633.jpg',
    'photos/thumbs/IMG_8634.jpg',
    'photos/thumbs/IMG_8635.jpg',
    'photos/thumbs/IMG_8636.jpg',
    'photos/thumbs/IMG_8637.jpg',
];

// Full-res originals for modal zoom
const PHOTOS_FULL = [
    'photos/IMG_8630.PNG',
    'photos/IMG_8631.PNG',
    'photos/IMG_8632.PNG',
    'photos/IMG_8633.PNG',
    'photos/IMG_8634.PNG',
    'photos/IMG_8635.PNG',
    'photos/IMG_8636.PNG',
    'photos/IMG_8637.PNG',
];

const EMOJI_PARTICLES = ['🌸', '💖', '🩷', '💕', '🌷', '✨', '💗', '🌺', '❤️', '🪻', '💐'];
const PARTICLE_COUNT = 20;
const FLOAT_ANIMATIONS = ['floatPhoto', 'floatPhotoAlt', 'floatPhotoDrift'];
const WAVES = 4;

// Shocked reactions that change on each slide
const REACTIONS = [
    { emoji: '😱', text: 'Waaa 3la zin !!' },
    { emoji: '🤯', text: 'Chkoun hadi ?!' },
    { emoji: '😍', text: 'Ya latiiiiif !!' },
    { emoji: '🥵', text: 'Trop belle wallah' },
    { emoji: '😳', text: '3la slama a zina !!' },
    { emoji: '💀', text: 'Mattiini b zinek' },
    { emoji: '🫠', text: 'Ana mdouweb !!' },
    { emoji: '🔥', text: 'Nar nar nar !!' },
];

// ---- FLOATING EMOJI PARTICLES ----
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const particle = document.createElement('span');
        particle.classList.add('particle');
        particle.textContent = EMOJI_PARTICLES[Math.floor(Math.random() * EMOJI_PARTICLES.length)];
        particle.setAttribute('aria-hidden', 'true');

        const size = 14 + Math.random() * 16;
        const left = Math.random() * 100;
        const startY = 80 + Math.random() * 30;
        const duration = 8 + Math.random() * 12;
        const delay = Math.random() * 15;

        particle.style.cssText = `
            font-size: ${size}px;
            left: ${left}%;
            top: ${startY}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;

        container.appendChild(particle);
    }
}

// ---- FLOATING HEART-SHAPED PHOTOS ----
function createFloatingPhotos() {
    const container = document.getElementById('floating-photos');
    if (!container) return;

    function spawnPhoto(index, delay) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('floating-heart-photo');

        const img = document.createElement('img');
        img.src = PHOTOS_THUMB[index % PHOTOS_THUMB.length];
        img.alt = `Photo ${(index % PHOTOS_THUMB.length) + 1}`;
        img.loading = 'lazy';
        img.decoding = 'async';

        const size = 60 + Math.random() * 55;
        const left = 2 + Math.random() * 90;
        const startY = 85 + Math.random() * 25;
        const animName = FLOAT_ANIMATIONS[Math.floor(Math.random() * FLOAT_ANIMATIONS.length)];
        const duration = 5 + Math.random() * 5;

        wrapper.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            top: ${startY}%;
            animation-name: ${animName};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;

        wrapper.addEventListener('click', () => openModal(PHOTOS_FULL[index % PHOTOS_FULL.length]));

        wrapper.appendChild(img);
        container.appendChild(wrapper);

        const totalTime = (delay + duration) * 1000;
        setTimeout(() => {
            wrapper.remove();
            spawnPhoto(index, Math.random() * 1.5);
        }, totalTime);
    }

    for (let wave = 0; wave < WAVES; wave++) {
        PHOTOS_THUMB.forEach((_, index) => {
            const initialDelay = wave * 1.2 + index * 0.4 + Math.random() * 1;
            spawnPhoto(wave * PHOTOS_THUMB.length + index, initialDelay);
        });
    }
}

// ---- PHOTO CAROUSEL ----
let currentSlide = 0;
let touchStartX = 0;
let touchEndX = 0;
let autoSlideTimer = null;

function createCarousel() {
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!track || !dotsContainer) return;

    PHOTOS_THUMB.forEach((photo, index) => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide');

        const img = document.createElement('img');
        img.src = photo;
        img.alt = `Photo ${index + 1}`;
        img.loading = index === 0 ? 'eager' : 'lazy';
        img.decoding = 'async';

        const counter = document.createElement('span');
        counter.classList.add('slide-counter');
        counter.textContent = `${index + 1} / ${PHOTOS_THUMB.length}`;

        slide.addEventListener('click', () => openModal(PHOTOS_FULL[index]));

        slide.appendChild(img);
        slide.appendChild(counter);
        track.appendChild(slide);

        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Photo ${index + 1}`);
        dot.addEventListener('click', () => {
            goToSlide(index);
            pauseAutoSlide();
            startAutoSlide();
        });
        dotsContainer.appendChild(dot);
    });

    // Touch/swipe support
    const wrapper = document.getElementById('carousel-wrapper');
    if (wrapper) {
        wrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            pauseAutoSlide();
        }, { passive: true });

        wrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoSlide();
        }, { passive: true });
    }

    startAutoSlide();
}

function goToSlide(index) {
    const track = document.getElementById('carousel-track');
    const dots = document.querySelectorAll('.carousel-dot');
    if (!track) return;

    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    // Update the reaction text/emoji for each slide
    updateReaction(index);
}

function updateReaction(index) {
    const reactionEmoji = document.querySelector('.reaction-emoji');
    const reactionText = document.querySelector('.reaction-text');
    if (!reactionEmoji || !reactionText) return;

    const reaction = REACTIONS[index % REACTIONS.length];

    // Quick pop animation
    reactionEmoji.style.transform = 'scale(0)';
    reactionText.style.opacity = '0';

    setTimeout(() => {
        reactionEmoji.textContent = reaction.emoji;
        reactionText.textContent = reaction.text;
        reactionEmoji.style.transform = 'scale(1)';
        reactionText.style.opacity = '1';
    }, 150);
}

function nextSlide() {
    goToSlide((currentSlide + 1) % PHOTOS_THUMB.length);
}

function prevSlide() {
    goToSlide((currentSlide - 1 + PHOTOS_THUMB.length) % PHOTOS_THUMB.length);
}

function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        diff > 0 ? nextSlide() : prevSlide();
    }
}

function startAutoSlide() {
    pauseAutoSlide();
    autoSlideTimer = setInterval(nextSlide, 3500);
}

function pauseAutoSlide() {
    if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
    }
}

// ---- PHOTO MODAL ----
function openModal(src) {
    const modal = document.getElementById('photo-modal');
    const modalImage = document.getElementById('modal-image');
    if (!modal || !modalImage) return;

    modalImage.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    pauseAutoSlide();
}

function closeModal() {
    const modal = document.getElementById('photo-modal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
    startAutoSlide();
}

function setupModal() {
    const backdrop = document.getElementById('modal-backdrop');
    const closeBtn = document.getElementById('modal-close');

    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// ---- TOUCH HEARTS ----
function setupTouchHearts() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.floating-heart-photo') || e.target.closest('.modal') || e.target.closest('.carousel-slide')) return;

        const hearts = ['💖', '💕', '❤️', '🩷', '💗'];
        const count = 3 + Math.floor(Math.random() * 4);

        for (let i = 0; i < count; i++) {
            const heart = document.createElement('span');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.cssText = `
                position: fixed;
                left: ${e.clientX + (Math.random() - 0.5) * 60}px;
                top: ${e.clientY + (Math.random() - 0.5) * 60}px;
                font-size: ${16 + Math.random() * 20}px;
                pointer-events: none;
                z-index: 9999;
                transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                opacity: 1;
            `;
            document.body.appendChild(heart);

            requestAnimationFrame(() => {
                heart.style.transform = `translateY(-${60 + Math.random() * 80}px) rotate(${(Math.random() - 0.5) * 40}deg) scale(0.3)`;
                heart.style.opacity = '0';
            });

            setTimeout(() => heart.remove(), 1100);
        }
    });
}

// ---- INITIALIZATION ----
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    createFloatingPhotos();
    createCarousel();
    setupModal();
    setupTouchHearts();
});
