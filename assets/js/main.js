(function () {
  var nav = document.getElementById("site-nav");
  var menuButton = document.querySelector(".menu-toggle");
  var themeButton = document.querySelector(".theme-toggle");
  var themeLabel = document.querySelector(".theme-label");
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
      if (event.key === "Escape") setMenu(false);
    });
  }

  function currentTheme() {
    try {
      return localStorage.getItem(themeKey) === "dark" ? "dark" : "light";
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
    var formattedPrice = "ca. " + new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 }).format(nok) + " kr";
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

  var today = new Date().toISOString().slice(0, 10);
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
})();
