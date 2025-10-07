
const navLinks = document.querySelectorAll('.nav-link, .logo');
const sections = document.querySelectorAll('.section');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Handle navigation clicks
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetSection = link.getAttribute('data-section');
        
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        link.classList.add('active');
        document.getElementById(targetSection).classList.add('active');
        
        navMenu.classList.remove('active');
    });
});

const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetSection = ctaButton.getAttribute('data-section');
        
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        document.getElementById(targetSection).classList.add('active');
        document.querySelector(`[data-section="${targetSection}"]`).classList.add('active');
    });
}

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

function openModal(activityId) {
    const modal = document.getElementById(activityId + '-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(activityId) {
    const modal = document.getElementById(activityId + '-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

window.addEventListener('click', (event) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});

let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

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

let ticking = false;

window.addEventListener('scroll', () => {
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

function openPhotoModal(photos) {
    const gallery = document.getElementById('photoGallery');
    gallery.innerHTML = '';

    photos.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.loading = "lazy";
        img.style.maxWidth = '150px';
        img.style.borderRadius = '10px';
        img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';

        // clic, ouvrir lightbox
        img.addEventListener('click', () => openLightbox(src));

        gallery.appendChild(img);
    });

    document.getElementById('photoModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // empêche scroll derrière
}

function openLightbox(src) {
    let lightbox = document.createElement('div');
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
    document.body.style.overflow = 'auto';
}

// Optimized scroll effects for home page
let fadeAnimationFrame = null;

window.addEventListener("scroll", () => {
    const homeSection = document.getElementById('home');
    if (!homeSection || !homeSection.classList.contains('active')) {
        return;
    }

    if (fadeAnimationFrame) {
        return;
    }

    fadeAnimationFrame = requestAnimationFrame(() => {
        const hero = document.querySelector("#home .hero");
        const competences = document.querySelector("#home .skills-content");
        const scrollY = window.scrollY;

        const heroStartFade = 650;
        const heroFadeRange = 450;
        const competencesOffset = 450;
        const fadePoint = 450;

        let heroOpacity = 1;
        if(scrollY > heroStartFade) {
            heroOpacity = 1 - (scrollY - heroStartFade) / heroFadeRange;
        }
        heroOpacity = Math.max(0, Math.min(1, heroOpacity));

        let competencesOpacity = 1;
        if(scrollY > competencesOffset) {
            competencesOpacity = 0.3 + (scrollY - competencesOffset) / fadePoint;
        }
        competencesOpacity = Math.min(1, competencesOpacity);
        if (hero) hero.style.opacity = heroOpacity;
        if (competences) competences.style.opacity = competencesOpacity;

        fadeAnimationFrame = null;
    });
});

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    const homeCompetences = document.querySelector("#home .skills-content");
    if (homeCompetences) {
        homeCompetences.style.opacity = "1";
        homeCompetences.style.willChange = "opacity";
    }
    
    // assure que les autres sections ont une opacité normale
    const activitiesContent = document.querySelector("#activities .about-content");
    if (activitiesContent) {
        activitiesContent.style.opacity = "1";
    }
    
    // Opti pour le hero
    const hero = document.querySelector("#home .hero");
    if (hero) {
        hero.style.willChange = "transform, opacity";
    }
});

// === Calcul automatique des heures totales ===
document.addEventListener("DOMContentLoaded", () => {
    const hourCells = document.querySelectorAll(".activities-table tbody td:last-child span");
    let total = 0;

    hourCells.forEach(cell => {
        const match = cell.textContent.match(/(\d+)\s*h/);
        if (match) total += parseInt(match[1]);
    });

    const totalHours = document.getElementById("totalHours");
    if (totalHours) totalHours.textContent = total + " h";
});
