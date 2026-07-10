(function () {
  var nav = document.getElementById("site-nav");
  var menuButton = document.querySelector(".menu-toggle");
  var themeButton = document.querySelector(".theme-toggle");
  var themeLabel = document.querySelector(".theme-label");
  var key = "jobbklar-theme";

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
      if (event.target && event.target.tagName === "A") {
        setMenu(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setMenu(false);
      }
    });
  }

  function resolveTheme(choice) {
    if (choice === "system") {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return choice === "dark" ? "dark" : "light";
  }

  function currentChoice() {
    try {
      return localStorage.getItem(key) || "light";
    } catch (error) {
      return "light";
    }
  }

  function applyTheme(choice) {
    var resolved = resolveTheme(choice);
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themeChoice = choice;
    if (themeButton) {
      themeButton.setAttribute("aria-pressed", String(resolved === "dark"));
      themeButton.setAttribute("aria-label", "Bytt tema. Aktivt valg: " + (choice === "system" ? "system" : resolved === "dark" ? "mørk" : "lys"));
    }
    if (themeLabel) {
      themeLabel.textContent = "Tema: " + (choice === "system" ? "System" : resolved === "dark" ? "Mørk" : "Lys");
    }
  }

  if (themeButton) {
    applyTheme(currentChoice());
    themeButton.addEventListener("click", function () {
      var choices = ["light", "dark", "system"];
      var next = choices[(choices.indexOf(currentChoice()) + 1) % choices.length];
      try {
        localStorage.setItem(key, next);
      } catch (error) {}
      applyTheme(next);
    });
  }

  if (window.matchMedia) {
    var media = window.matchMedia("(prefers-color-scheme: dark)");
    var listener = function () {
      if (currentChoice() === "system") {
        applyTheme("system");
      }
    };
    if (media.addEventListener) {
      media.addEventListener("change", listener);
    } else if (media.addListener) {
      media.addListener(listener);
    }
  }
})();
