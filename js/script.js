// Navigation functionality
const navLinks = document.querySelectorAll('.nav-link, .logo');
const sections = document.querySelectorAll('.section');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Handle navigation clicks
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetSection = link.getAttribute('data-section');
        
        // Remove active class from all links and sections
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked link and corresponding section
        link.classList.add('active');
        document.getElementById(targetSection).classList.add('active');
        
        // Close mobile menu if open
        navMenu.classList.remove('active');
    });
});

// Handle CTA button click
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetSection = ctaButton.getAttribute('data-section');
        
        // Remove active class from all
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        // Activate target section and corresponding nav link
        document.getElementById(targetSection).classList.add('active');
        document.querySelector(`[data-section="${targetSection}"]`).classList.add('active');
    });
}

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Modal functionality
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

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Close modal with Escape key
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

// Smooth scrolling effect for navbar
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

// Enhanced animations and effects
document.addEventListener('DOMContentLoaded', () => {
    // Animate table rows on hover
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

    // Add typing effect to hero title
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

// Add parallax effect to background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

function openPhotoModal(photos) {
    const gallery = document.getElementById('photoGallery');
    gallery.innerHTML = ''; // reset

    photos.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.style.maxWidth = '150px';
        img.style.borderRadius = '10px';
        img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';

        // Au clic, ouvrir lightbox
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

    // fermer au clic
    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('show');
        setTimeout(() => lightbox.remove(), 300);
    });

    document.body.appendChild(lightbox);
    setTimeout(() => lightbox.classList.add('show'), 10); // animation fade-in
}

function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.addEventListener("scroll", () => {
    const hero = document.querySelector(".hero");
    const competences = document.querySelector(".about-content");

    const scrollY = window.scrollY;

    // Seuils
    const heroStartFade = 450;      // scrollY à partir duquel le hero commence à disparaître
    const heroFadeRange = 300;      // distance sur laquelle le hero disparaît complètement
    const competencesOffset = 500;  // scrollY à partir duquel les compétences commencent à apparaître
    const fadePoint = 400;          // distance de fondu pour les compétences

    // Opacité pour hero
    let heroOpacity = 1;
    if(scrollY > heroStartFade) {
        heroOpacity = 1 - (scrollY - heroStartFade) / heroFadeRange;
    }
    if (heroOpacity < 0) heroOpacity = 0;
    if (heroOpacity > 1) heroOpacity = 1;

    // Opacité pour competences
    let competencesOpacity = 0.2;
    if(scrollY > competencesOffset) {
        competencesOpacity = 0.2 + (scrollY - competencesOffset) / fadePoint;
    }
    if (competencesOpacity > 1) competencesOpacity = 1;

    // Application
    hero.style.opacity = heroOpacity;
    competences.style.opacity = competencesOpacity;
});

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".about-content").style.opacity = "0.2";
});