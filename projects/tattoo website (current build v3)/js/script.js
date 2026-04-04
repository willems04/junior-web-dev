const menuToggle = document.querySelector('.menu-toggle');
const siteMenu = document.querySelector('.site-menu');

if (menuToggle && siteMenu) {
    menuToggle.addEventListener('click', () => {
        const isOpen = siteMenu.classList.toggle('is-open');
        menuToggle.classList.toggle('is-open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (event) => {
        const clickedInsideMenu = siteMenu.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            siteMenu.classList.remove('is-open');
            menuToggle.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const menuLinks = document.querySelectorAll('.site-menu a');

menuLinks.forEach((link) => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
        link.classList.add('is-active');
    }

    link.addEventListener('click', () => {
        if (siteMenu && menuToggle && window.innerWidth <= 760) {
            siteMenu.classList.remove('is-open');
            menuToggle.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.14 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
}

const yearTargets = document.querySelectorAll('[data-year]');
yearTargets.forEach((item) => {
    item.textContent = String(new Date().getFullYear());
});

const lightbox = document.getElementById('gallery-lightbox');

if (lightbox) {
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const prevButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');
    const galleryButtons = Array.from(document.querySelectorAll('.gallery-item'));
    let activeIndex = -1;

    const showImage = (index) => {
        if (!galleryButtons.length) return;

        const normalized = (index + galleryButtons.length) % galleryButtons.length;
        const selectedImage = galleryButtons[normalized].querySelector('img');

        if (!selectedImage || !lightboxImage) return;

        activeIndex = normalized;
        lightboxImage.src = selectedImage.src;
        lightboxImage.alt = selectedImage.alt;

        if (lightboxCaption) {
            lightboxCaption.textContent = selectedImage.alt;
        }
    };

    const openLightbox = (index) => {
        showImage(index);
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    galleryButtons.forEach((button, index) => {
        button.addEventListener('click', () => openLightbox(index));
    });

    if (closeButton) {
        closeButton.addEventListener('click', closeLightbox);
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (activeIndex !== -1) showImage(activeIndex - 1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (activeIndex !== -1) showImage(activeIndex + 1);
        });
    }

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!lightbox.classList.contains('open')) return;

        if (event.key === 'Escape') {
            closeLightbox();
        }

        if (event.key === 'ArrowLeft') {
            showImage(activeIndex - 1);
        }

        if (event.key === 'ArrowRight') {
            showImage(activeIndex + 1);
        }
    });
}

const bookingForm = document.getElementById('booking-form');

if (bookingForm) {
    const bookingStatus = document.getElementById('booking-status');

    bookingForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!bookingForm.checkValidity()) {
            bookingForm.reportValidity();

            if (bookingStatus) {
                bookingStatus.textContent = 'Please complete all required fields before sending.';
                bookingStatus.classList.remove('is-success');
                bookingStatus.classList.add('is-error');
            }

            return;
        }

        const formData = new FormData(bookingForm);
        const fullName = String(formData.get('fullName') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const phone = String(formData.get('phone') || '').trim() || 'Not provided';
        const preferredDate = String(formData.get('preferredDate') || '').trim();
        const placement = String(formData.get('placement') || '').trim();
        const size = String(formData.get('size') || '').trim();
        const style = String(formData.get('style') || '').trim();
        const idea = String(formData.get('idea') || '').trim();

        const subject = `Tattoo Booking Request - ${fullName}`;
        const body = [
            'New tattoo consultation request',
            '',
            `Name: ${fullName}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            `Preferred date/month: ${preferredDate}`,
            `Placement: ${placement}`,
            `Approx size: ${size}`,
            `Style: ${style}`,
            '',
            'Idea / notes:',
            idea
        ].join('\n');

        const mailtoUrl = `mailto:conrad@tattoostudio.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;

        if (bookingStatus) {
            bookingStatus.textContent = 'Your email app should open with the booking request ready to send.';
            bookingStatus.classList.remove('is-error');
            bookingStatus.classList.add('is-success');
        }
    });
}
