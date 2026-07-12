(function () {
  var nav = document.getElementById("site-nav");
  var menuButton = document.querySelector(".menu-toggle");
  var themeButton = document.querySelector(".theme-toggle");
  var themeLabel = document.querySelector(".theme-label");
  var mobileCta = document.querySelector(".mobile-cta");
  var hero = document.querySelector(".hero");
  var footer = document.querySelector(".site-footer");
  var priceSection = document.getElementById("pris");
  var finalCta = document.querySelector(".final-cta");
  var themeKey = "jobbklar-theme";
  var rateKey = "jobbklar-usd-nok-v1";
  var usdPriceIncludingVat = 12.5;

  function setMenu(open) {
    if (!nav || !menuButton) return;
    nav.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });

    nav.addEventListener("click", function (event) {
      if (event.target && event.target.tagName === "A") setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        menuButton.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) setMenu(false);
    });
  }

  function currentTheme() {
    try {
      var stored = localStorage.getItem(themeKey);
      if (stored === "dark" || stored === "light") return stored;
      return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    } catch (error) {
      return "light";
    }
  }

  function applyTheme(choice) {
    var theme = choice === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.themeChoice = theme;
    if (themeButton) {
      themeButton.setAttribute("aria-pressed", String(theme === "dark"));
      themeButton.setAttribute("aria-label", theme === "dark" ? "Bytt til lyst tema" : "Bytt til mørkt tema");
    }
    if (themeLabel) themeLabel.textContent = "Tema: " + (theme === "dark" ? "Mørk" : "Lys");
  }

  if (themeButton) {
    applyTheme(currentTheme());
    themeButton.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(themeKey, next);
      } catch (error) {}
      applyTheme(next);
    });
  }

  function updatePrice(rate, sourceDate) {
    if (!Number.isFinite(rate) || rate < 5 || rate > 20) return;
    var nok = Math.round(usdPriceIncludingVat * rate);
    var formattedPrice = "Estimert " + new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 }).format(nok) + " kr";
    document.querySelectorAll("[data-price-nok]").forEach(function (element) {
      element.textContent = formattedPrice;
    });

    if (sourceDate) {
      var parsedDate = new Date(sourceDate + "T12:00:00");
      var formattedDate = new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "long", year: "numeric" }).format(parsedDate);
      document.querySelectorAll("[data-rate-status]").forEach(function (element) {
        element.textContent = "Beregnet med siste tilgjengelige USD/NOK-kurs fra " + formattedDate + ". Gumroad eller kortutsteder kan bruke en litt annen kurs.";
      });
    }
  }

  function readCachedRate() {
    try {
      var cached = JSON.parse(localStorage.getItem(rateKey) || "null");
      if (cached && Number.isFinite(cached.rate)) return cached;
    } catch (error) {}
    return null;
  }

  function localCalendarDate(date) {
    function pad(value) {
      return String(value).padStart(2, "0");
    }
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  var today = localCalendarDate(new Date());
  var cachedRate = readCachedRate();
  if (cachedRate) updatePrice(cachedRate.rate, cachedRate.sourceDate);

  if (!cachedRate || cachedRate.checkedDate !== today) {
    fetch("https://api.frankfurter.dev/v2/rate/USD/NOK", { headers: { Accept: "application/json" } })
      .then(function (response) {
        if (!response.ok) throw new Error("Kunne ikke hente valutakurs");
        return response.json();
      })
      .then(function (data) {
        var rate = Number(data.rate);
        if (!Number.isFinite(rate) || rate < 5 || rate > 20) throw new Error("Ugyldig valutakurs");
        var entry = { rate: rate, sourceDate: data.date || today, checkedDate: today };
        try {
          localStorage.setItem(rateKey, JSON.stringify(entry));
        } catch (error) {}
        updatePrice(entry.rate, entry.sourceDate);
      })
      .catch(function () {
        document.querySelectorAll("[data-rate-status]").forEach(function (element) {
          if (!cachedRate) element.textContent = "NOK-prisen er et estimat. Endelig beløp vises hos Gumroad før betaling.";
        });
      });
  }

  function setMobileCta(show) {
    if (!mobileCta) return;
    mobileCta.classList.toggle("is-visible", show);
    mobileCta.setAttribute("aria-hidden", String(!show));
    mobileCta.tabIndex = show ? 0 : -1;
    document.body.classList.toggle("has-mobile-cta", show);
  }

  function updateMobileCta() {
    if (!mobileCta || window.innerWidth > 760) {
      setMobileCta(false);
      return;
    }
    var heroPassed = hero ? hero.getBoundingClientRect().bottom < 96 : window.scrollY > 360;
    var footerVisible = footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
    var priceRect = priceSection ? priceSection.getBoundingClientRect() : null;
    var finalRect = finalCta ? finalCta.getBoundingClientRect() : null;
    var conversionSectionVisible =
      (priceRect && priceRect.top < window.innerHeight && priceRect.bottom > 0) ||
      (finalRect && finalRect.top < window.innerHeight && finalRect.bottom > 0);
    setMobileCta(heroPassed && !footerVisible && !conversionSectionVisible);
  }

  if (mobileCta) {
    var mobileCtaTicking = false;
    function requestMobileCtaUpdate() {
      if (mobileCtaTicking) return;
      mobileCtaTicking = true;
      window.requestAnimationFrame(function () {
        updateMobileCta();
        mobileCtaTicking = false;
      });
    }
    setMobileCta(false);
    updateMobileCta();
    window.addEventListener("scroll", requestMobileCtaUpdate, { passive: true });
    window.addEventListener("resize", requestMobileCtaUpdate);
  }
})();
