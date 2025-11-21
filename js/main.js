const body = document.body;
const navLinks = document.querySelector(".nav-links");
const navToggle = document.querySelector(".nav-toggle");
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");
const sliderTrack = document.querySelector(".slider-track");
const prevBtn = document.querySelector(".slider-control.prev");
const nextBtn = document.querySelector(".slider-control.next");
const yearSpan = document.getElementById("year");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

/* Navigation toggle */
navToggle?.addEventListener("click", () => {
  navLinks?.classList.toggle("open");
  body.classList.toggle("menu-open");
});

/* Close menu on link click */
navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    body.classList.remove("menu-open");
  });
});

/* Custom cursor - only for non-touch devices */
if (!('ontouchstart' in window)) {
  window.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
    cursorOutline.style.transform = `translate(${clientX}px, ${clientY}px)`;
  });

  document.querySelectorAll("a, button, .btn").forEach((interactive) => {
    interactive.addEventListener("mouseenter", () => {
      cursorOutline.style.transform = `${cursorOutline.style.transform} scale(1.5)`;
    });
    interactive.addEventListener("mouseleave", () => {
      cursorOutline.style.transform = cursorOutline.style.transform.replace(/ scale\(1\.5\)/g, "");
    });
  });
} else {
  // Hide cursor elements on mobile
  if (cursorDot) cursorDot.style.display = "none";
  if (cursorOutline) cursorOutline.style.display = "none";
}


/* Testimonials slider */
let currentSlide = 0;
const cards = sliderTrack ? Array.from(sliderTrack.children) : [];

const updateSlider = () => {
  if (!sliderTrack || !cards.length) return;
  const gap = 24;
  const cardWidth = cards[0].getBoundingClientRect().width + gap;
  sliderTrack.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
};

prevBtn?.addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + cards.length) % cards.length;
  updateSlider();
});

nextBtn?.addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % cards.length;
  updateSlider();
});

window.addEventListener("resize", updateSlider);
window.addEventListener("load", updateSlider);

/* GSAP animations */
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM and GSAP to be ready
window.addEventListener("load", () => {
  // Hero image animation
  const heroImage = document.querySelector(".hero-image-card");
  if (heroImage) {
    // Animate in
    gsap.fromTo(heroImage, 
      { opacity: 0, y: 80, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
        onComplete: () => {
          // Start floating animation after initial animation completes
          gsap.to(heroImage, {
            y: -20,
            duration: 3,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
          });
        }
      }
    );
  }

  // Hero text animation
  const heroText = document.querySelector(".hero-text");
  if (heroText) {
    gsap.fromTo(heroText.children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
      }
    );
  }

  // Section animations (excluding gallery)
  gsap.utils.toArray(".section").forEach((section) => {
    if (!section.classList.contains("gallery")) {
      gsap.from(section, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });
    }
  });

  // Gallery scroll animation - unique parallax effect
  const galleryItems = document.querySelectorAll(".gallery-item");
  const gallerySection = document.querySelector(".gallery");
  
  if (galleryItems.length > 0 && gallerySection) {
    // Create a single ScrollTrigger for all items
    ScrollTrigger.create({
      trigger: gallerySection,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const scrollProgress = self.progress;
        const totalItems = galleryItems.length;
        
        galleryItems.forEach((item, index) => {
          // Calculate which item should be active based on scroll
          const targetIndex = Math.floor(scrollProgress * totalItems);
          const distance = index - targetIndex;
          const absDistance = Math.abs(distance);
          
          let opacity, scale, y, rotation, zIndex;
          
          if (distance === 0) {
            // Active item - fully visible
            opacity = 1;
            scale = 1;
            y = 0;
            rotation = 0;
            zIndex = 10;
          } else if (distance < 0) {
            // Future item - scroll down to see (comes forward)
            opacity = Math.max(0.2, 1 - absDistance * 0.3);
            scale = Math.max(0.7, 1 - absDistance * 0.15);
            y = 80 + absDistance * 30;
            rotation = 5 + absDistance * 2;
            zIndex = 5 - absDistance;
          } else {
            // Past item - scrolled past (goes back)
            opacity = Math.max(0.2, 1 - absDistance * 0.3);
            scale = Math.max(0.7, 1 - absDistance * 0.15);
            y = -80 - absDistance * 30;
            rotation = -5 - absDistance * 2;
            zIndex = 5 - absDistance;
          }
          
          // Clamp values
          opacity = Math.max(0.2, Math.min(1, opacity));
          scale = Math.max(0.7, Math.min(1, scale));
          zIndex = Math.max(1, Math.min(10, zIndex));
          
          gsap.to(item, {
            opacity: opacity,
            scale: scale,
            y: y,
            rotation: rotation,
            zIndex: zIndex,
            duration: 0.1,
            ease: "none",
          });
        });
      },
    });
  }
});

/* Contact form handling */
const contactForm = document.querySelector(".contact-form");
contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  const name = data.get("name") || "there";
  alert(`Thanks ${name}! I will reply shortly.`);
  contactForm.reset();
});

