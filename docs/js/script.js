// Smooth scroll for navigation links
const navLinks = document.querySelectorAll('.nav-a');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

const closeMobileMenu = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
};

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        navToggle.classList.toggle('active', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Only prevent default for hash links
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' 
                });
            }
        }
        
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        // Add active class to clicked link
        this.classList.add('active');

        if (window.innerWidth <= 768) {
            closeMobileMenu();
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current || link.getAttribute('href').includes('#' + current)) {
            link.classList.add('active');
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.2)';
    } else {
        header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('.section, .gallery, .services, .hours, .contact, .cta-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Gallery lightbox on tattoos page
const lightbox = document.getElementById('gallery-lightbox');

if (lightbox) {
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const galleryCards = document.querySelectorAll('.gallery-grid-full .gallery-card1');
    const galleryImages = Array.from(galleryCards)
        .map((card) => card.querySelector('img'))
        .filter((image) => image);
    let currentImageIndex = -1;

    const updateLightboxImage = (index) => {
        if (!lightboxImage || galleryImages.length === 0) return;

        const wrappedIndex = (index + galleryImages.length) % galleryImages.length;
        const image = galleryImages[wrappedIndex];

        currentImageIndex = wrappedIndex;
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt || 'Gallery image';

        if (lightboxCaption) {
            lightboxCaption.textContent = image.alt || '';
        }
    };

    const openLightbox = (image) => {
        if (!image) return;

        const selectedIndex = galleryImages.indexOf(image);
        if (selectedIndex === -1) return;

        updateLightboxImage(selectedIndex);

        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    galleryCards.forEach((card) => {
        const image = card.querySelector('img');
        if (!image) return;

        card.style.cursor = 'pointer';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        card.addEventListener('click', () => openLightbox(image));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(image);
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
            if (currentImageIndex === -1) return;
            updateLightboxImage(currentImageIndex - 1);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            if (currentImageIndex === -1) return;
            updateLightboxImage(currentImageIndex + 1);
        });
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;

        if (e.key === 'Escape') {
            closeLightbox();
            return;
        }

        if (e.key === 'ArrowLeft' && currentImageIndex !== -1) {
            updateLightboxImage(currentImageIndex - 1);
        }

        if (e.key === 'ArrowRight' && currentImageIndex !== -1) {
            updateLightboxImage(currentImageIndex + 1);
        }
    });
}
