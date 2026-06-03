/* ===================================
   SCRIPT.JS - Love Page for Safaa
   =================================== */

// ---- CONFIG ----
const PHOTOS = [
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
const WAVES = 6; // number of duplicate waves for density

function createFloatingPhotos() {
    const container = document.getElementById('floating-photos');
    if (!container) return;

    function spawnPhoto(index, delay) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('floating-heart-photo');

        const img = document.createElement('img');
        img.src = PHOTOS[index % PHOTOS.length];
        img.alt = `Photo ${(index % PHOTOS.length) + 1}`;
        img.loading = 'lazy';
        img.decoding = 'async';

        // Random sizing
        const size = 60 + Math.random() * 55; // 60px to 115px
        const left = 2 + Math.random() * 90; // spread across full width
        const startY = 85 + Math.random() * 25; // start near bottom

        // Pick a random float animation
        const animName = FLOAT_ANIMATIONS[Math.floor(Math.random() * FLOAT_ANIMATIONS.length)];
        const duration = 5 + Math.random() * 5; // FAST: 5s to 10s

        wrapper.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            top: ${startY}%;
            animation-name: ${animName};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;

        // Click to open modal
        wrapper.addEventListener('click', () => openModal(PHOTOS[index % PHOTOS.length]));

        wrapper.appendChild(img);
        container.appendChild(wrapper);

        // After animation ends, remove and respawn immediately
        const totalTime = (delay + duration) * 1000;
        setTimeout(() => {
            wrapper.remove();
            // Respawn almost immediately with new random position
            spawnPhoto(index, Math.random() * 1.5);
        }, totalTime);
    }

    // Spawn many waves for high density of photos on screen
    for (let wave = 0; wave < WAVES; wave++) {
        PHOTOS.forEach((_, index) => {
            const initialDelay = wave * 1.2 + index * 0.4 + Math.random() * 1;
            spawnPhoto(wave * PHOTOS.length + index, initialDelay);
        });
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
}

function closeModal() {
    const modal = document.getElementById('photo-modal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
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

// ---- TOUCH HEARTS (tap anywhere to spawn hearts) ----
function setupTouchHearts() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.floating-heart-photo') || e.target.closest('.modal')) return;

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
    setupModal();
    setupTouchHearts();
});
