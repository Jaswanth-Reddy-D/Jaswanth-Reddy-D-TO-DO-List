 /* ─── TYPING ANIMATION ─── */
  const phrases = [
    "web experiences.",
    "clean interfaces.",
    "interactive UIs.",
    "cool stuff. 🚀"
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const typedEl = document.getElementById("typed-text");

  function type() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      typedEl.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) { deleting = true; setTimeout(type, 2000); return; }
    } else {
      typedEl.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 50 : 90);
  }
  setTimeout(type, 1200);
  
 /* ─── SCROLL REVEAL ─── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  /* ─── NAV SCROLL SHRINK ─── */
  window.addEventListener("scroll", () => {
    document.querySelector("nav").style.padding =
      window.scrollY > 60 ? "0.75rem 6vw" : "1.2rem 6vw";
  });

  /* ─── FORM SUBMIT ─── */
  function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector(".submit-btn");
    btn.textContent = "Sent! ✓";
    btn.style.background = "#3ddb7f";
    btn.style.boxShadow = "0 0 30px rgba(61,219,127,0.4)";
    setTimeout(() => {
      btn.textContent = "Send Message ✦";
      btn.style.background = "var(--accent)";
      btn.style.boxShadow = "";
      e.target.reset();
    }, 2500);
  }