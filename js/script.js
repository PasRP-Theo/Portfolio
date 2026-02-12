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
            if (modal.id === 'photoModal' && photoKeydownHandler) {
                document.removeEventListener('keydown', photoKeydownHandler);
                currentPhotos = [];
                currentPhotoIndex = 0;
            }
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

// === Masquage de la navbar au scroll (optimisé avec throttle) ===
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
let scrollTicking = false;

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollTop = scrollTop;
            scrollTicking = false;
        });
        scrollTicking = true;
    }
});

// === Effets sur les lignes du tableau (optimisés) ===
document.addEventListener('DOMContentLoaded', () => {
    const tableRows = document.querySelectorAll('.activities-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.transform = 'scale(1.02)';
            row.style.boxShadow = '0 8px 25px rgba(74, 105, 189, 0.15)';
        });
        row.addEventListener('mouseleave', () => {
            row.style.transform = 'scale(1)';
            row.style.boxShadow = 'none';
        });
    });
});

// === Galerie photo + Lightbox ===
let currentPhotos = [];
let photoKeydownHandler = null;

function openPhotoModal(photos) {
    if (photos.length === 0) return;
    
    currentPhotos = photos.filter(src => src && src !== 'css/img/');
    
    const gallery = document.getElementById('photoGallery');
    gallery.innerHTML = '';
    
    // Conteneur principal avec contrôles
    const mainContainer = document.createElement('div');
    mainContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 20px;
    `;
    
    // Conteneur wrapper pour le carrousel avec boutons
    const controlsWrapper = document.createElement('div');
    controlsWrapper.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        width: 100%;
    `;
    
    // Bouton précédent
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '‹';
    prevBtn.className = 'carousel-btn';
    prevBtn.style.cssText = `
        background: linear-gradient(135deg, #1976d2, #0d47a1);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        flex-shrink: 0;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(25, 118, 210, 0.4);
    `;
    prevBtn.onmouseover = () => {
        prevBtn.style.transform = 'scale(1.1)';
        prevBtn.style.boxShadow = '0 6px 20px rgba(25, 118, 210, 0.6)';
    };
    prevBtn.onmouseout = () => {
        prevBtn.style.transform = 'scale(1)';
        prevBtn.style.boxShadow = '0 4px 15px rgba(25, 118, 210, 0.4)';
    };
    prevBtn.onclick = () => scrollGalleryContainer(-200);
    
    // Conteneur scrollable pour les images
    const imagesContainer = document.createElement('div');
    imagesContainer.id = 'imagesContainer';
    imagesContainer.style.cssText = `
        display: flex;
        gap: 15px;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 10px 0;
        scroll-behavior: smooth;
        width: 100%;
        max-width: 600px;
        max-height: 200px;
        scrollbar-width: thin;
        scrollbar-color: #1976d2 rgba(25, 118, 210, 0.1);
    `;
    
    // Créer les images
    currentPhotos.forEach((src, index) => {
        const imgWrapper = document.createElement('div');
        imgWrapper.style.cssText = `
            flex-shrink: 0;
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        const img = document.createElement('img');
        img.src = src;
        img.loading = 'lazy';
        img.style.cssText = `
            height: 180px;
            width: auto;
            max-width: 150px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            object-fit: cover;
        `;
        
        img.onmouseover = () => {
            img.style.transform = 'scale(1.05)';
            img.style.boxShadow = '0 8px 20px rgba(25, 118, 210, 0.4)';
        };
        img.onmouseout = () => {
            img.style.transform = 'scale(1)';
            img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        };
        
        img.addEventListener('click', () => openLightbox(src));
        
        imgWrapper.appendChild(img);
        imagesContainer.appendChild(imgWrapper);
    });
    
    // Bouton suivant
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '›';
    nextBtn.className = 'carousel-btn';
    nextBtn.style.cssText = `
        background: linear-gradient(135deg, #1976d2, #0d47a1);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        flex-shrink: 0;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(25, 118, 210, 0.4);
    `;
    nextBtn.onmouseover = () => {
        nextBtn.style.transform = 'scale(1.1)';
        nextBtn.style.boxShadow = '0 6px 20px rgba(25, 118, 210, 0.6)';
    };
    nextBtn.onmouseout = () => {
        nextBtn.style.transform = 'scale(1)';
        nextBtn.style.boxShadow = '0 4px 15px rgba(25, 118, 210, 0.4)';
    };
    nextBtn.onclick = () => scrollGalleryContainer(200);
    
    controlsWrapper.appendChild(prevBtn);
    controlsWrapper.appendChild(imagesContainer);
    controlsWrapper.appendChild(nextBtn);
    
    // Indicateur de progression
    const indicator = document.createElement('div');
    indicator.id = 'photoIndicator';
    indicator.style.cssText = `
        text-align: center;
        color: #666;
        font-size: 0.9rem;
        font-weight: bold;
    `;
    indicator.textContent = `${currentPhotos.length} photo${currentPhotos.length > 1 ? 's' : ''}`;
    
    mainContainer.appendChild(controlsWrapper);
    mainContainer.appendChild(indicator);
    gallery.appendChild(mainContainer);
    
    // Navigation au clavier
    photoKeydownHandler = (event) => {
        if (document.getElementById('photoModal').style.display === 'block') {
            if (event.key === 'ArrowLeft') scrollGalleryContainer(-200);
            if (event.key === 'ArrowRight') scrollGalleryContainer(200);
        }
    };
    document.addEventListener('keydown', photoKeydownHandler);
    
    document.getElementById('photoModal').style.display = 'block';
    disableScroll();
}

function scrollGalleryContainer(distance) {
    const container = document.getElementById('imagesContainer');
    if (container) {
        container.scrollBy({
            left: distance,
            behavior: 'smooth'
        });
    }
}

function openLightbox(src) {
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    lightbox.innerHTML = `<img src="${src}" alt="Photo">`;

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
    if (photoKeydownHandler) {
        document.removeEventListener('keydown', photoKeydownHandler);
    }
    currentPhotos = [];
    currentPhotoIndex = 0;
}

// === Effet de fade optimisé (uniquement sur la page home) ===
let fadeAnimationFrame = null;

window.addEventListener('scroll', () => {
    const homeSection = document.getElementById('home');
    if (!homeSection || !homeSection.classList.contains('active')) return;

    if (fadeAnimationFrame) return;

    fadeAnimationFrame = requestAnimationFrame(() => {
        const hero = document.querySelector('#home .hero');
        const competences = document.querySelector('#home .skills-content');
        const scrollY = window.scrollY;

        // Paramètres optimisés pour un fade plus doux
        const heroStartFade = 400;
        const heroFadeRange = 300;
        const competencesOffset = 200;
        const fadePoint = 300;

        // Calcul de l'opacité du hero
        let heroOpacity = 1;
        if (scrollY > heroStartFade) {
            heroOpacity = 1 - (scrollY - heroStartFade) / heroFadeRange;
        }
        heroOpacity = Math.max(0, Math.min(1, heroOpacity));

        // Calcul de l'opacité des compétences
        let competencesOpacity = 0.3;
        if (scrollY > competencesOffset) {
            competencesOpacity = 0.3 + (scrollY - competencesOffset) / fadePoint;
        }
        competencesOpacity = Math.min(1, competencesOpacity);

        // Application des opacités
        if (hero) hero.style.opacity = heroOpacity;
        if (competences) competences.style.opacity = competencesOpacity;

        fadeAnimationFrame = null;
    });
});

// === Initialisation styles au chargement ===
document.addEventListener('DOMContentLoaded', () => {
    const homeCompetences = document.querySelector('#home .skills-content');
    if (homeCompetences) {
        homeCompetences.style.opacity = '0.3';
    }

    const activitiesContent = document.querySelector('#activities .about-content');
    if (activitiesContent) {
        activitiesContent.style.opacity = '1';
    }
});

// === Calcul automatique du total d'heures ===
document.addEventListener('DOMContentLoaded', () => {
    const hourCells = document.querySelectorAll('.activities-table tbody td:last-child span');
    let total = 0;

    hourCells.forEach(cell => {
        const match = cell.textContent.match(/(\d+)\s*h/);
        if (match) total += parseInt(match[1]);
    });

    // Total d'heures réel
    const totalHours = document.getElementById('totalHours');
    if (totalHours) totalHours.textContent = total + ' h';

    // Total valorisé (plafonné à 60h)
    const totalValorise = Math.min(total, 60);
    const totalValoriseElement = document.getElementById('totalValorise');
    if (totalValoriseElement) totalValoriseElement.textContent = totalValorise + ' h';
});