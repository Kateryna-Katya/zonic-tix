document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MOBILE MENU TOGGLE
    // ==========================================
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ==========================================
    // 2. DYNAMIC YEAR
    // ==========================================
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ==========================================
    // 3. SCROLL REVEAL ANIMATION (Intersection Observer)
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // ==========================================
    // 4. COOKIE POPUP
    // ==========================================
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    
    // Check localStorage
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookiePopup.classList.add('active');
        }, 2000); // Show after 2 seconds
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookiePopup.classList.remove('active');
        });
    }

    // ==========================================
    // 5. HERO ANIMATION (THREE.JS)
    // ==========================================
    function initHeroAnimation() {
        const container = document.getElementById('hero-canvas');
        if (!container || typeof THREE === 'undefined') return;

        let scene, camera, renderer, particles;
        let count = 0;

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 10000);
            camera.position.z = 1000;
            camera.position.y = 300;

            const numParticles = 3000;
            const positions = new Float32Array(numParticles * 3);
            const scales = new Float32Array(numParticles);

            let i = 0, j = 0;
            for (let ix = 0; ix < 50; ix++) {
                for (let iy = 0; iy < 60; iy++) {
                    positions[i] = ix * 100 - ((50 * 100) / 2);
                    positions[i + 1] = 0;
                    positions[i + 2] = iy * 100 - ((60 * 100) / 2);
                    scales[j] = 1;
                    i += 3;
                    j++;
                }
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

            const material = new THREE.PointsMaterial({
                color: 0x06B6D4,
                size: 20,
                transparent: true,
                opacity: 0.6,
                sizeAttenuation: true
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);
            renderer.setClearColor(0x000000, 0); 

            window.addEventListener('resize', onWindowResize);
        }

        function onWindowResize() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        function animate() {
            requestAnimationFrame(animate);
            render();
        }

        function render() {
            const positions = particles.geometry.attributes.position.array;
            const scales = particles.geometry.attributes.scale.array;
            let i = 0, j = 0;
            for (let ix = 0; ix < 50; ix++) {
                for (let iy = 0; iy < 60; iy++) {
                    positions[i + 1] = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
                    scales[j] = (Math.sin((ix + count) * 0.3) + 1) * 10 + (Math.sin((iy + count) * 0.5) + 1) * 10;
                    i += 3; j++;
                }
            }
            particles.geometry.attributes.position.needsUpdate = true;
            particles.geometry.attributes.scale.needsUpdate = true;
            particles.rotation.y += 0.002;
            count += 0.05;
            renderer.render(scene, camera);
        }

        init();
        animate();
    }
    initHeroAnimation();

    // ==========================================
    // 6. CONTACT FORM LOGIC (Validation + Captcha)
    // ==========================================
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');
    
    // Captcha Logic
    const captchaInput = document.getElementById('captcha');
    const captchaLabel = document.getElementById('captchaLabel');
    const captchaError = document.getElementById('captchaError');
    let captchaResult = 0;

    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        captchaResult = num1 + num2;
        if(captchaLabel) captchaLabel.textContent = `Решите пример: ${num1} + ${num2} = ?`;
    }
    generateCaptcha();

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // 1. Phone Validation (Digits only)
            const phone = document.getElementById('phone');
            const phoneError = document.getElementById('phoneError');
            const phoneRegex = /^\d+$/; // Only digits

            if (!phoneRegex.test(phone.value.replace(/\s/g, ''))) {
                phoneError.textContent = 'Телефон должен содержать только цифры';
                phone.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                phoneError.textContent = '';
                phone.style.borderColor = 'rgba(255,255,255,0.1)';
            }

            // 2. Email Validation
            const email = document.getElementById('email');
            const emailError = document.getElementById('emailError');
            if (!email.value.includes('@') || !email.value.includes('.')) {
                emailError.textContent = 'Введите корректный email';
                email.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                emailError.textContent = '';
                email.style.borderColor = 'rgba(255,255,255,0.1)';
            }

            // 3. Captcha Validation
            if (parseInt(captchaInput.value) !== captchaResult) {
                captchaError.textContent = 'Неверный ответ';
                captchaInput.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                captchaError.textContent = '';
                captchaInput.style.borderColor = 'rgba(255,255,255,0.1)';
            }

            if (isValid) {
                // Simulate AJAX
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.textContent = 'Отправка...';
                btn.disabled = true;

                setTimeout(() => {
                    form.style.display = 'none';
                    successMsg.style.display = 'block';
                    btn.textContent = originalText;
                    btn.disabled = false;
                    form.reset();
                }, 1500);
            }
        });
    }
});