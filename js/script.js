const navLinks = document.querySelectorAll('.nav-link, .logo');
const sections = document.querySelectorAll('.section');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// === Navigation entre sections ===
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetSection = link.getAttribute('data-section');
        if (!targetSection) return;

        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        link.classList.add('active');
        document.getElementById(targetSection)?.classList.add('active');

        navMenu.classList.remove('active');
    });
});

const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', (e) => {
        e.preventDefault();

        const targetSection = ctaButton.getAttribute('data-section');
        if (!targetSection) return;

        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        document.getElementById(targetSection)?.classList.add('active');
        document.querySelector(`[data-section="${targetSection}"]`)?.classList.add('active');
    });
}

// === Menu mobile ===
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// === Gestion des modals ===
function disableScroll() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.height = '100%';
}

function enableScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.height = '';
}

function openModal(activityId) {
    const modal = document.getElementById(activityId + '-modal');
    if (modal) {
        modal.style.display = 'block';
        disableScroll();
    }
}

function closeModal(activityId) {
    const modal = document.getElementById(activityId + '-modal');
    if (modal) {
        modal.style.display = 'none';
        enableScroll();
    }
}

window.addEventListener('click', (event) => {
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            enableScroll();
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                enableScroll();
            }
        });
    }
});

// === Masquage de la navbar au scroll ===
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;
});

// === Effets sur les lignes du tableau ===
document.addEventListener('DOMContentLoaded', () => {
    const tableRows = document.querySelectorAll('.activities-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.transform = 'scale(1.02)';
            row.style.boxShadow = '0 10px 30px rgba(74, 105, 189, 0.1)';
        });
        row.addEventListener('mouseleave', () => {
            row.style.transform = 'scale(1)';
            row.style.boxShadow = 'none';
        });
    });

    // === Effet machine à écrire sur le hero ===
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        setTimeout(typeWriter, 500);
    }
});

// === Parallaxe optimisée (désactivée sur mobile) ===
let ticking = false;

window.addEventListener('scroll', () => {
    if (window.innerWidth <= 768) return; // désactive sur mobile

    if (!ticking) {
        window.requestAnimationFrame(() => {
            const homeSection = document.getElementById('home');
            if (!homeSection || !homeSection.classList.contains('active')) {
                ticking = false;
                return;
            }

            const scrolled = window.pageYOffset;
            const hero = document.querySelector('#home .hero');
            if (hero) {
                const speed = 0.3;
                hero.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// === Galerie photo + Lightbox ===
function openPhotoModal(photos) {
    const gallery = document.getElementById('photoGallery');
    gallery.innerHTML = '';

    photos.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.loading = 'lazy';
        img.style.maxWidth = '150px';
        img.style.borderRadius = '10px';
        img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';

        img.addEventListener('click', () => openLightbox(src));
        gallery.appendChild(img);
    });

    document.getElementById('photoModal').style.display = 'block';
    disableScroll();
}

function openLightbox(src) {
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    lightbox.innerHTML = `<img src="${src}">`;

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('show');
        setTimeout(() => lightbox.remove(), 300);
    });

    document.body.appendChild(lightbox);
    setTimeout(() => lightbox.classList.add('show'), 10);
}

function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    modal.style.display = 'none';
    enableScroll();
}

// === Effet de fade du hero & compétences ===
let fadeAnimationFrame = null;

window.addEventListener('scroll', () => {
    const homeSection = document.getElementById('home');
    if (!homeSection || !homeSection.classList.contains('active')) return;

    if (fadeAnimationFrame) return;

    fadeAnimationFrame = requestAnimationFrame(() => {
        const hero = document.querySelector('#home .hero');
        const competences = document.querySelector('#home .skills-content');
        const scrollY = window.scrollY;

        const heroStartFade = 650;
        const heroFadeRange = 450;
        const competencesOffset = 450;
        const fadePoint = 450;

        let heroOpacity = 1;
        if (scrollY > heroStartFade)
            heroOpacity = 1 - (scrollY - heroStartFade) / heroFadeRange;
        heroOpacity = Math.max(0, Math.min(1, heroOpacity));

        let competencesOpacity = 1;
        if (scrollY > competencesOffset)
            competencesOpacity = 0.3 + (scrollY - competencesOffset) / fadePoint;
        competencesOpacity = Math.min(1, competencesOpacity);

        if (hero) hero.style.opacity = heroOpacity;
        if (competences) competences.style.opacity = competencesOpacity;

        fadeAnimationFrame = null;
    });
});

// === Initialisation styles au chargement ===
document.addEventListener('DOMContentLoaded', () => {
    const homeCompetences = document.querySelector('#home .skills-content');
    if (homeCompetences) {
        homeCompetences.style.opacity = '1';
        homeCompetences.style.willChange = 'opacity';
    }

    const activitiesContent = document.querySelector('#activities .about-content');
    if (activitiesContent) activitiesContent.style.opacity = '1';

    const hero = document.querySelector('#home .hero');
    if (hero) hero.style.willChange = 'transform, opacity';
});

// === Calcul automatique du total d'heures ===
document.addEventListener('DOMContentLoaded', () => {
    const hourCells = document.querySelectorAll('.activities-table tbody td:last-child span');
    let total = 0;

    hourCells.forEach(cell => {
        const match = cell.textContent.match(/(\d+)\s*h/);
        if (match) total += parseInt(match[1]);
    });

    const totalHours = document.getElementById('totalHours');
    if (totalHours) totalHours.textContent = total + ' h';
});