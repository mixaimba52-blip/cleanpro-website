// Элементы интерфейса
const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
const navAnchors = navMenu.querySelectorAll('a[href^="#"]');
const sections = document.querySelectorAll("main section[id]");
const revealElements = document.querySelectorAll(".reveal");
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

document.documentElement.classList.add("js");

function closeMenu(returnFocus = false) {
    const wasOpen = navMenu.classList.contains("open");

    navMenu.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Открыть меню");

    if (returnFocus && wasOpen) {
        menuToggle.focus();
    }
}

function openMenu() {
    navMenu.classList.add("open");
    menuToggle.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Закрыть меню");
}

// Открытие/закрытие мобильного меню
menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("open");
    if (isOpen) {
        closeMenu(false);
    } else {
        openMenu();
    }
});

// Плавная прокрутка с учётом высоты шапки
navAnchors.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (!targetSection) {
            return;
        }

        event.preventDefault();
        const headerHeight = header.offsetHeight;
        const extraOffset = 16;
        const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;

        window.scrollTo({
            top: targetPosition,
            behavior: reduceMotionQuery.matches ? "auto" : "smooth"
        });

        closeMenu(true);
    });
});

// Закрытие меню при клике вне навигации
document.addEventListener("click", (event) => {
    const isClickInsideNav = navMenu.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);

    if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains("open")) {
        closeMenu(true);
    }
});

// Закрытие меню клавишей Escape
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("open")) {
        closeMenu(true);
    }
});

// Закрытие меню при изменении размера окна
window.addEventListener("resize", () => {
    if (window.innerWidth > 920 && navMenu.classList.contains("open")) {
        closeMenu(false);
    }
});

// Подсветка активного пункта меню и тень у шапки при прокрутке
function handleScroll() {
    const scrollPosition = window.scrollY;
    header.classList.toggle("scrolled", scrollPosition > 12);

    let currentSectionId = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - header.offsetHeight - 40;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSectionId = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${currentSectionId}`;
        link.classList.toggle("active", isActive);
    });
}

window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

// Аккуратное появление элементов при прокрутке
function initRevealAnimations() {
    if (reduceMotionQuery.matches || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach((element) => observer.observe(element));
}

initRevealAnimations();
