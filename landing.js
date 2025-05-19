document.addEventListener('DOMContentLoaded', function() {
    createStars();
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    //smooth scorll 
    const updateDate = document.querySelector('.update-date');
    if (updateDate) {
        const metaDate = document.querySelector('meta[name="last-updated"]');
        if (metaDate) {
            updateDate.textContent = metaDate.getAttribute('content');
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    initCarousel();
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .game-card, .about-text, .about-image').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', () => {
            window.location.href = 'game.html';
        });
    });
});

// Initialize carousel
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const leftController = document.querySelector('.controller.left');
    const rightController = document.querySelector('.controller.right');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // Handle index bounds
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            restartInterval();
        });
    });
    if (leftController) {
        leftController.addEventListener('click', () => {
            showSlide(currentSlide - 1);
            restartInterval();
        });
    }
    
    if (rightController) {
        rightController.addEventListener('click', () => {
            showSlide(currentSlide + 1);
            restartInterval();
        });
    }

    //  slides
    function startInterval() {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000); // Change slide every 5 seconds
    }

    function restartInterval() {
        clearInterval(slideInterval);
        startInterval();
    }
    startInterval();

    // Pause 
    const carousel = document.querySelector('.preview-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            startInterval();
        });
    }
}

function createStars() {
    const starsContainer = document.getElementById('stars-container');
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.animationDelay = `${Math.random() * 4}s`;
        
        starsContainer.appendChild(star);
    }
}
const style = document.createElement('style');
style.innerHTML = `
    .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .reveal.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .feature-card:nth-child(2) {
        transition-delay: 0.2s;
    }
    
    .feature-card:nth-child(3) {
        transition-delay: 0.4s;
    }
    
    .feature-card:nth-child(4) {
        transition-delay: 0.6s;
    }
    
    .game-card:nth-child(2) {
        transition-delay: 0.15s;
    }
    
    .game-card:nth-child(3) {
        transition-delay: 0.3s;
    }
    
    .game-card:nth-child(4) {
        transition-delay: 0.45s;
    }
    
    .game-card:nth-child(5) {
        transition-delay: 0.6s;
    }
`;
document.head.appendChild(style);