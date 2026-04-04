// Smooth scroll for navigation links
const navLinks = document.querySelectorAll('.nav-a');

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
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
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

// Gallery card click handler - navigate to tattoos.html
const galleryCards = document.querySelectorAll('.gallery-card');

galleryCards.forEach(card => {
    card.addEventListener('click', function() {
        window.location.href = 'tattoos.html';
    });
});

// Add cursor pointer to gallery cards
galleryCards.forEach(card => {
    card.style.cursor = 'pointer';
});