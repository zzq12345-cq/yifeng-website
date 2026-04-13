/* =============================================
   宜丰电子科技 – 交互脚本（华为级极简）
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    headerScroll();
    heroSlider();
    scrollReveal();
    smoothScroll();
    backToTop();
    mobileMenu();
    contactForm();
});

/* ---------- Header ---------- */
function headerScroll() {
    const h = document.getElementById('header');
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const update = () => {
        h.classList.toggle('scrolled', scrollY > 60);

        // Active link
        const pos = scrollY + 200;
        sections.forEach(s => {
            const top = s.offsetTop, bot = top + s.offsetHeight;
            if (pos >= top && pos < bot) {
                const id = s.id;
                links.forEach(l => {
                    l.classList.toggle('active',
                        l.getAttribute('href') === '#' + id);
                });
            }
        });
    };
    addEventListener('scroll', update, { passive: true });
    update();
}

/* ---------- Hero Slider ---------- */
function heroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    let cur = 0, timer;

    function go(i) {
        slides[cur].classList.remove('active');
        dots[cur].classList.remove('active');
        cur = i;
        slides[cur].classList.add('active');
        dots[cur].classList.add('active');
    }

    function auto() { timer = setInterval(() => go((cur + 1) % slides.length), 6000); }
    function stop() { clearInterval(timer); }

    dots.forEach(d => d.addEventListener('click', () => {
        stop(); go(+d.dataset.i); auto();
    }));

    // Touch
    let sx = 0;
    const el = document.querySelector('.hero');
    el.addEventListener('touchstart', e => { sx = e.changedTouches[0].screenX; stop(); }, { passive: true });
    el.addEventListener('touchend', e => {
        const d = sx - e.changedTouches[0].screenX;
        if (Math.abs(d) > 50) go(d > 0 ? (cur + 1) % slides.length : (cur - 1 + slides.length) % slides.length);
        auto();
    }, { passive: true });

    auto();
}

/* ---------- Scroll Reveal ---------- */
function scrollReveal() {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
}

/* ---------- Smooth Scroll ---------- */
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const t = document.querySelector(a.getAttribute('href'));
            if (t) {
                const y = t.getBoundingClientRect().top + scrollY - 56;
                scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });
}

/* ---------- Back to Top ---------- */
function backToTop() {
    const b = document.getElementById('btt');
    addEventListener('scroll', () => b.classList.toggle('visible', scrollY > 500), { passive: true });
    b.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Mobile Menu ---------- */
function mobileMenu() {
    const btn = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    btn.addEventListener('click', () => {
        btn.classList.toggle('open');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
    nav.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
        btn.classList.remove('open');
        nav.classList.remove('open');
        document.body.style.overflow = '';
    }));
}

/* ---------- Contact Form ---------- */
function contactForm() {
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('.submit-btn');
        const txt = btn.textContent;
        btn.textContent = '提交中…';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = '✓ 已提交';
            btn.style.background = '#00875a';
            setTimeout(() => { form.reset(); btn.textContent = txt; btn.disabled = false; btn.style.background = ''; }, 2000);
        }, 800);
    });
}
