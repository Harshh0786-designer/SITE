/* =========================================================
   Digital Birbal — site interactions
   ========================================================= */
(() => {
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = () => window.matchMedia('(max-width: 760px)').matches;
    const PAGES = { home: 'index.html', services: 'services.html' };
    const currentPage = document.body.dataset.page || 'home';

    /* ---------- Header border on scroll ---------- */
    const header = $('.site-header');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- Mobile navigation ---------- */
    const menuBtn = $('#menu-btn');
    const nav = $('#primary-nav');

    const setMenu = (open) => {
        nav.classList.toggle('is-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    menuBtn.addEventListener('click', () => {
        const open = !nav.classList.contains('is-open');
        if (open) {
            setSearch(false);
            setProfile(false);
        }
        setMenu(open);
    });

    $$('a', nav).forEach((link) => link.addEventListener('click', () => setMenu(false)));

    /* ---------- Active nav link while scrolling ---------- */
    const navLinks = $$('a[href^="#"]', nav);
    const sections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
    if ('IntersectionObserver' in window) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navLinks.forEach((a) =>
                    a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`)
                );
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach((s) => spy.observe(s));
    }

    /* ---------- Smooth scroll + highlight helper ----------
       Scrolls to a section on this page, or opens the other page at that section. */
    const goTo = (hash, page = 'home') => {
        const target = page === currentPage ? $(hash) : null;
        if (!target) {
            window.location.href = PAGES[page] + hash;
            return;
        }
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        try { history.replaceState(null, '', hash); } catch {}
        window.dispatchEvent(new HashChangeEvent('hashchange')); // lets the carousel open the right slide
        if (target.classList.contains('service-card')) {
            target.classList.remove('is-highlight');
            void target.offsetWidth; // restart the animation
            target.classList.add('is-highlight');
        }
    };

    /* =========================================================
       Search
       ========================================================= */
    const SEARCH_INDEX = [
        { title: 'Website Development', type: 'Service', url: 'website-development.html',
          keywords: 'website web site design development developer landing page hosting domain maintenance redesign' },
        { title: 'Meta & Google Ads', type: 'Service', url: 'meta-google-ads.html',
          keywords: 'meta facebook instagram google ads adwords ppc paid advertising campaigns youtube display retargeting leads sales performance marketing' },
        { title: 'Social Media Handling', type: 'Service', url: 'social-media-handling.html',
          keywords: 'social media instagram facebook linkedin content posts reels carousel calendar management community smm captions' },
        { title: 'SEO Services', type: 'Service', url: 'seo-services.html',
          keywords: 'seo search engine optimisation optimization google ranking rank keywords local business profile gmb backlinks audit traffic' },
        { title: 'Brand Identity', type: 'Service', url: 'brand-identity.html',
          keywords: 'brand branding identity logo design colours colors typography guidelines stationery visiting card' },
        { title: 'CMS Solutions', type: 'Service', url: 'cms-solutions.html',
          keywords: 'cms content management system wordpress headless update edit website blog' },
        { title: 'E-commerce Solutions', type: 'Service', url: 'ecommerce-solutions.html',
          keywords: 'ecommerce e-commerce online store shop shopify woocommerce payments cart products selling' },
        { title: 'Mobile App', type: 'Service', url: 'mobile-app.html',
          keywords: 'mobile app application android ios iphone play store app store development' },
        { title: 'All services', type: 'Page', page: 'services', href: '#all-services',
          keywords: 'all services explore list everything offer offering' },
        { title: 'Why one roof', type: 'Section', page: 'home', href: '#why',
          keywords: 'why us benefits one team strategy report agency all in one' },
        { title: 'Our process', type: 'Section', page: 'home', href: '#process',
          keywords: 'process steps how it works discover plan launch grow onboarding' },
        { title: 'FAQs', type: 'Section', page: 'home', href: '#faq',
          keywords: 'faq questions help budget pricing price cost fee results ownership small business startup' },
        { title: 'Contact & free consultation', type: 'Section', page: 'home', href: '#contact',
          keywords: 'contact enquiry enquire inquiry quote consultation email call talk hire start' },
        { title: 'Sign in to your account', type: 'Account', action: 'signin',
          keywords: 'login log in sign in account profile portal client dashboard' },
    ];
    const SUGGESTED = SEARCH_INDEX.filter((item) => item.type === 'Service').slice(0, 4);

    const search = $('#search');
    const searchToggle = $('#search-toggle');
    const searchForm = $('#search-form');
    const searchInput = $('#search-input');
    const resultsList = $('#search-results');
    let results = [];
    let activeIndex = -1;

    const findMatches = (query) => {
        const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
        if (!terms.length) return SUGGESTED;
        return SEARCH_INDEX
            .map((item) => {
                const title = item.title.toLowerCase();
                const haystack = `${title} ${item.keywords}`;
                let score = 0;
                for (const term of terms) {
                    if (!haystack.includes(term)) return null;
                    score += title.includes(term) ? 3 : 1;
                }
                return { item, score };
            })
            .filter(Boolean)
            .sort((a, b) => b.score - a.score)
            .map((r) => r.item);
    };

    const renderResults = () => {
        const query = searchInput.value.trim();
        results = findMatches(query);
        activeIndex = -1;
        resultsList.innerHTML = '';

        if (!query) {
            const label = document.createElement('li');
            label.className = 'search-results-label';
            label.setAttribute('role', 'presentation');
            label.textContent = 'Popular services';
            resultsList.append(label);
        }

        if (!results.length) {
            const empty = document.createElement('li');
            empty.className = 'search-empty';
            empty.setAttribute('role', 'presentation');
            empty.append('No matches. ');
            const link = document.createElement('a');
            link.href = currentPage === 'home' ? '#contact' : 'index.html#contact';
            link.textContent = 'Ask us directly';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                closeResults();
                setSearch(false);
                goTo('#contact', 'home');
            });
            empty.append(link);
            resultsList.append(empty);
        }

        results.forEach((item, i) => {
            const li = document.createElement('li');
            li.className = 'search-result';
            li.id = `search-option-${i}`;
            li.setAttribute('role', 'option');
            li.setAttribute('aria-selected', 'false');
            const title = document.createElement('span');
            title.textContent = item.title;
            const type = document.createElement('span');
            type.className = 'search-result-type';
            type.textContent = item.type;
            li.append(title, type);
            li.addEventListener('mousedown', (e) => e.preventDefault()); // keep focus in input
            li.addEventListener('click', () => selectResult(i));
            resultsList.append(li);
        });

        resultsList.hidden = false;
        searchInput.setAttribute('aria-expanded', 'true');
    };

    const setActive = (index) => {
        const options = $$('.search-result', resultsList);
        if (!options.length) return;
        activeIndex = (index + options.length) % options.length;
        options.forEach((opt, i) => {
            const on = i === activeIndex;
            opt.classList.toggle('is-active', on);
            opt.setAttribute('aria-selected', String(on));
        });
        searchInput.setAttribute('aria-activedescendant', options[activeIndex].id);
        options[activeIndex].scrollIntoView({ block: 'nearest' });
    };

    const closeResults = () => {
        resultsList.hidden = true;
        activeIndex = -1;
        searchInput.setAttribute('aria-expanded', 'false');
        searchInput.removeAttribute('aria-activedescendant');
    };

    const selectResult = (index) => {
        const item = results[index];
        if (!item) return;
        closeResults();
        searchInput.value = '';
        searchInput.blur();
        setSearch(false);
        if (item.action === 'signin') openAuth('signin');
        else if (item.url) window.location.href = item.url; // service landing page
        else goTo(item.href, item.page);
    };

    function setSearch(open) {
        search.classList.toggle('is-open', open);
        searchToggle.setAttribute('aria-expanded', String(open));
        searchToggle.setAttribute('aria-label', open ? 'Close search' : 'Open search');
        if (open) {
            setMenu(false);
            setProfile(false);
            searchInput.focus();
        } else {
            closeResults();
        }
    }

    searchToggle.addEventListener('click', () => setSearch(!search.classList.contains('is-open')));
    searchInput.addEventListener('focus', renderResults);
    searchInput.addEventListener('input', renderResults);

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (resultsList.hidden) renderResults();
            setActive(activeIndex + 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive(activeIndex - 1);
        } else if (e.key === 'Escape') {
            closeResults();
            if (isMobile()) {
                setSearch(false);
                searchToggle.focus();
            } else {
                searchInput.blur();
            }
        }
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        selectResult(activeIndex >= 0 ? activeIndex : 0);
    });

    searchInput.addEventListener('blur', () => {
        // Delay so a click on a result registers first
        setTimeout(() => {
            if (document.activeElement !== searchInput) closeResults();
        }, 120);
    });

    // Press "/" anywhere to jump to search
    document.addEventListener('keydown', (e) => {
        if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
        if ($('#auth-dialog').open) return;
        e.preventDefault();
        if (isMobile()) setSearch(true);
        else searchInput.focus();
    });

    /* =========================================================
       Profile menu
       ========================================================= */
    const profile = $('#profile');
    const profileBtn = $('#profile-btn');
    const profileMenu = $('#profile-menu');
    const menuItems = $$('[role="menuitem"]', profileMenu);

    function setProfile(open, focusFirst = false) {
        profileMenu.hidden = !open;
        profileBtn.setAttribute('aria-expanded', String(open));
        if (open) {
            setMenu(false);
            if (isMobile()) setSearch(false);
            if (focusFirst) menuItems[0].focus();
        }
    }

    profileBtn.addEventListener('click', () => setProfile(profileMenu.hidden));
    profileBtn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setProfile(true, true);
        }
    });

    profileMenu.addEventListener('keydown', (e) => {
        const i = menuItems.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            menuItems[(i + 1) % menuItems.length].focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            menuItems[(i - 1 + menuItems.length) % menuItems.length].focus();
        } else if (e.key === 'Escape') {
            setProfile(false);
            profileBtn.focus();
        } else if (e.key === 'Tab') {
            setProfile(false);
        }
    });

    menuItems.forEach((item) => item.addEventListener('click', () => setProfile(false)));

    /* ---------- Close popovers on outside click / Escape ---------- */
    document.addEventListener('click', (e) => {
        if (!profile.contains(e.target)) setProfile(false);
        if (!search.contains(e.target)) {
            closeResults();
            if (isMobile()) setSearch(false);
        }
        if (!nav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (!profileMenu.hidden) {
            setProfile(false);
            profileBtn.focus();
        }
        if (nav.classList.contains('is-open')) {
            setMenu(false);
            menuBtn.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (!window.matchMedia('(max-width: 1100px)').matches) setMenu(false);
        if (!isMobile()) search.classList.remove('is-open');
    });

    /* =========================================================
       Sign-in / create-account dialog
       The client portal needs a backend; until one is connected
       the form explains that instead of pretending to sign in.
       ========================================================= */
    const dialog = $('#auth-dialog');
    const authForm = $('#auth-form');
    const authStatus = $('#auth-status');
    const AUTH_COPY = {
        signin: {
            title: 'Sign in',
            sub: 'Access your project updates and reports.',
            submit: 'Sign in',
            switchText: 'New here? ',
            switchLabel: 'Create an account',
            switchTo: 'signup',
        },
        signup: {
            title: 'Create account',
            sub: 'Track your projects, campaigns and reports in one place.',
            submit: 'Create account',
            switchText: 'Already have an account? ',
            switchLabel: 'Sign in',
            switchTo: 'signin',
        },
    };

    function openAuth(mode) {
        const copy = AUTH_COPY[mode] || AUTH_COPY.signin;
        $('#auth-title').textContent = copy.title;
        $('#auth-sub').textContent = copy.sub;
        $('#auth-submit').textContent = copy.submit;
        $('.auth-name-field', dialog).hidden = mode !== 'signup';
        $('#auth-password').autocomplete = mode === 'signup' ? 'new-password' : 'current-password';

        const switchEl = $('#auth-switch');
        switchEl.textContent = copy.switchText;
        const switchBtn = document.createElement('button');
        switchBtn.type = 'button';
        switchBtn.textContent = copy.switchLabel;
        switchBtn.addEventListener('click', () => openAuth(copy.switchTo));
        switchEl.append(switchBtn);

        authStatus.textContent = '';
        if (!dialog.open) dialog.showModal();
        $('#auth-email').focus();
    }

    $$('[data-open-auth]').forEach((btn) =>
        btn.addEventListener('click', () => openAuth(btn.dataset.openAuth))
    );

    // Close when clicking the backdrop
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.close();
    });

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = $('#auth-email');
        const password = $('#auth-password');
        if (!email.checkValidity() || !password.checkValidity()) {
            authStatus.textContent = 'Please enter a valid email and a password of at least 6 characters.';
            return;
        }
        authStatus.textContent =
            'Our client portal is launching soon. In the meantime, use the contact form and our team will help you directly.';
    });

    /* =========================================================
       Contact form
       - If data-endpoint is set (e.g. a Formspree URL), submissions are POSTed there.
       - Otherwise the visitor's email app opens with the enquiry pre-filled.
       ========================================================= */
    const form = $('#contact-form');
    const status = $('#form-status');
    if (form) {
        // A service passed from the services page (index.html?service=...#contact) is pre-selected
        const requested = new URLSearchParams(window.location.search).get('service');
        if (requested) {
            const box = $$('input[name="services"]', form).find((i) => i.value === requested);
            if (box) box.checked = true;
        }

        // "Enquire about …" links pre-select the matching service chip
        $$('.service-link[data-service]').forEach((link) =>
            link.addEventListener('click', () => {
                const box = $$('input[name="services"]', form).find((i) => i.value === link.dataset.service);
                if (box) box.checked = true;
            })
        );

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const required = $$('[required]', form);
            let firstInvalid = null;
            required.forEach((field) => {
                const valid = field.value.trim() !== '' && field.checkValidity();
                field.setAttribute('aria-invalid', String(!valid));
                if (!valid && !firstInvalid) firstInvalid = field;
            });
            if (firstInvalid) {
                status.textContent = 'Please add your name, a valid email address and a short message.';
                firstInvalid.focus();
                return;
            }

            const data = new FormData(form);
            const services = data.getAll('services');
            const endpoint = form.dataset.endpoint;
            const submitBtn = $('button[type="submit"]', form);

            if (endpoint) {
                submitBtn.disabled = true;
                status.textContent = 'Sending…';
                try {
                    const res = await fetch(endpoint, {
                        method: 'POST',
                        body: data,
                        headers: { Accept: 'application/json' },
                    });
                    if (!res.ok) throw new Error(res.statusText);
                    form.reset();
                    required.forEach((f) => f.removeAttribute('aria-invalid'));
                    status.textContent = 'Thank you! Your enquiry has been sent. We will be in touch soon.';
                } catch {
                    status.textContent = `Something went wrong. Please email us at ${form.dataset.email}.`;
                } finally {
                    submitBtn.disabled = false;
                }
                return;
            }

            const body = [
                `Name: ${data.get('name')}`,
                `Email: ${data.get('email')}`,
                data.get('phone') ? `Phone: ${data.get('phone')}` : '',
                services.length ? `Services: ${services.join(', ')}` : '',
                '',
                data.get('message'),
            ].filter((line, i, arr) => line !== '' || arr[i - 1] !== '').join('\n');
            const subject = `New enquiry from ${data.get('name')}`;
            window.location.href =
                `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            status.textContent = `Opening your email app… If nothing happens, email us at ${form.dataset.email}.`;
        });

        $$('[required]', form).forEach((field) =>
            field.addEventListener('input', () => field.removeAttribute('aria-invalid'))
        );
    }

    /* =========================================================
       Services carousel (services page): 2x2 cards per slide
       Dots, swipe (scroll-snap) and arrow keys; arrow buttons are optional.
       ========================================================= */
    const track = $('#carousel-track');
    if (track) {
        const slides = $$('.carousel-slide', track);
        const dots = $$('.carousel-dot');
        const prevBtn = $('#carousel-prev');
        const nextBtn = $('#carousel-next');
        const counter = $('#carousel-current');
        let current = 0;

        const update = (index) => {
            current = index;
            slides.forEach((slide, i) => {
                const on = i === index;
                slide.inert = !on;
                slide.setAttribute('aria-hidden', String(!on));
            });
            dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
            if (prevBtn) prevBtn.disabled = index === 0;
            if (nextBtn) nextBtn.disabled = index === slides.length - 1;
            counter.textContent = index + 1;
        };

        const show = (index, instant = false) => {
            const i = Math.max(0, Math.min(slides.length - 1, index));
            track.scrollTo({ left: slides[i].offsetLeft, behavior: instant || reduceMotion ? 'auto' : 'smooth' });
            update(i);
        };

        prevBtn?.addEventListener('click', () => show(current - 1));
        nextBtn?.addEventListener('click', () => show(current + 1));
        dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));

        track.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
        });

        // Keep dots in sync when the visitor swipes
        let scrollTimer;
        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                let nearest = 0;
                slides.forEach((slide, i) => {
                    if (Math.abs(slide.offsetLeft - track.scrollLeft) < Math.abs(slides[nearest].offsetLeft - track.scrollLeft)) nearest = i;
                });
                if (nearest !== current) update(nearest);
            }, 80);
        }, { passive: true });

        window.addEventListener('resize', () => show(current, true));

        // Open on the slide holding a linked service (services.html#svc-...)
        const openFromHash = () => {
            const card = window.location.hash && $(window.location.hash);
            const slide = card && card.closest('.carousel-slide');
            if (!slide) return false;
            show(slides.indexOf(slide), true);
            card.classList.remove('is-highlight');
            void card.offsetWidth;
            card.classList.add('is-highlight');
            return true;
        };
        if (!openFromHash()) update(0);
        window.addEventListener('hashchange', openFromHash);
    }

    /* =========================================================
       Scroll reveal
       ========================================================= */
    const revealEls = $$('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
        // Stagger siblings slightly
        revealEls.forEach((el) => {
            const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
            el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 80}ms`;
        });
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach((el) => io.observe(el));
    }

    /* ---------- Footer year ---------- */
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
})();
