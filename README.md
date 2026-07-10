# Jobbklar-nettside

Dette repoet inneholder en statisk GitHub Pages-side for Jobbklar, bygget med vanlig HTML, CSS og litt vanilla JavaScript. Kjøpsknapper peker til Gumroad-produktet:

`https://matspark8.gumroad.com/l/Jobbklar`

## Publisering på GitHub Pages

1. Push filene til GitHub-repoet.
2. Gå til repository Settings, deretter Pages.
3. Velg riktig branch, vanligvis `main`, og publiser fra rotmappen `/`.
4. Vent til GitHub Pages er ferdig bygget.
5. Åpne den offentlige URL-en og kontroller forsiden, ressursene, 404-siden og Gumroad-lenkene.

Denne lokale utgaven er generert med base-URL:

`https://jobbklar-no.github.io/`

Dersom GitHub Pages-adressen eller eget domene er en annen, kjør generatoren på nytt med riktig verdi:

```powershell
$env:JOBBKLAR_SITE_URL="https://jobbklar-no.github.io/"
& "C:\Users\soope\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" tools\build_site.py
```

Kontroller etterpå `canonical`, `robots.txt`, `sitemap.xml` og Open Graph-URL-er.

## Google Search Console

1. Legg til den offentlige URL-en som en property.
2. Bruk verifiseringsmetoden du velger i Search Console.
3. Legg ikke inn en verifiseringskode i HTML før koden faktisk er utstedt.
4. Send inn sitemap: `https://jobbklar-no.github.io/sitemap.xml`.
5. Bruk URL Inspection på forsiden og de viktigste ressursartiklene etter lansering.

Bing Webmaster Tools kan settes opp på samme måte etter lansering.

## Tester etter publisering

- Rich Results Test for strukturert data på forsiden.
- PageSpeed Insights for ytelse, tilgjengelighet og SEO.
- Manuell test av mobilmeny, temabryter, detaljer/FAQ og Gumroad-lenker.
- Kontroll av at alle delingssider viser `assets/img/jobbklar-og.jpg`.

## Pris og CTA

Nettsiden viser ikke fast pris, fordi pris og valuta håndteres på Gumroad. CTA-teksten bruker derfor «Se pris og kjøp». Hvis en fast pris senere skal vises på nettsiden, oppdater synlig tekst, Product JSON-LD og README samtidig. Legg bare inn `Offer` i strukturert data når pris, valuta og tilgjengelighet er bekreftet.

## Bilder

Produktbildene ligger i `assets/img/` som PNG og WebP. HTML-en bruker eksplisitte `width` og `height`, norsk alt-tekst og lokale bildefiler. Hvis bildene byttes, behold samme filnavn eller oppdater HTML, Open Graph-bilde og manifest samtidig.

## Personvern

Det er ikke lagt inn analyseverktøy eller cookies. Hvis analyse legges til senere, må personvernteksten oppdateres, og samtykkeløsning må vurderes før scriptet aktiveres.
