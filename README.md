# 길 · Cesta po Koreji — korejština A1 offline

Offline PWA kurz korejštiny do úrovně A1. Mapa jako linky soulského metra: Hangul → Přílet → Soul každý den → Zábava → Cesta domů. Každá zastávka = slovíčka, gramatika, scénka, výzva a razítko do pasu.

## Nasazení na GitHub Pages

1. Na GitHubu vytvoř nové veřejné repo, např. `korejstina`.
2. **Add file → Upload files** a nahraj všechny soubory z této složky (ne složku samotnou).
3. **Settings → Pages → Branch: main, / (root) → Save.**
4. Za minutu otevři `https://365benidorm.github.io/korejstina/` v Chrome na Androidu → ⋮ → **Instalovat aplikaci** / **Přidat na plochu**.
5. Appku jednou otevři online – service worker si uloží všechno a pak běží i v letadle.

## Korejský hlas offline (Android)

Nastavení → Systém → Jazyky a vstup → Výstup převodu textu na řeč → Google → ⚙️ → Instalovat hlasová data → korejština. Návod je i v appce (⚙️).

## Aktualizace

Při změně souborů zvyš `CACHE` v `sw.js` (např. `gil-v1.0.1`), jinak telefon drží starou verzi.

## Soubory

- `data.js` – veškerý obsah (slova, věty, gramatika, scénky, tipy)
- `app.js` – logika (mapa, cvičení, opakování, nastavení)
- `styles.css`, `index.html`, `sw.js`, `manifest.webmanifest`, ikony
