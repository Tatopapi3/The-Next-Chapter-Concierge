# The Next Chapter Concierge

A professional website for Lillya Nashanchik — Senior Transition Specialist helping adults 55+ and their families navigate major life transitions with clarity, dignity, and peace of mind.

**Live Site → [thenextchapterconcierge.co](https://www.thenextchapterconcierge.co)**

---

## About

The Next Chapter Concierge guides individuals and families through some of life's most significant transitions — downsizing, relocating, estate organization, and more. The website serves as the primary touchpoint for new clients, offering information on services, Lillya's background, and a free downloadable guide.

---

## Pages

| Page | Description |
|---|---|
| `index.html` | Homepage with hero, services overview, and testimonials |
| `about.html` | Lillya's story and credentials |
| `services.html` | Full breakdown of transition services offered |
| `guide.html` | Free guide download — "A Daughter's Guide to Helping an Aging Parent" |
| `contact.html` | Contact form with Netlify form handling |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Markup | HTML5 |
| Styling | Custom CSS (no frameworks) |
| Scripts | Vanilla JavaScript |
| Forms | Netlify Forms |
| Email | Netlify Functions (subscribe) |
| Fonts | Google Fonts — Cormorant Garamond + Lato |
| Deployment | Netlify |

---

## Running Locally

No build step required — just open `index.html` in a browser, or use a local server:

```bash
npx serve .
```

---

## Deploying

The site auto-deploys via Netlify on every push to `main`.

To deploy manually:
```bash
netlify deploy --prod
```

---

## Project Structure

```
index.html          # Homepage
about.html          # About Lillya
services.html       # Services
guide.html          # Free guide download
contact.html        # Contact form
css/
  styles.css        # All styles
js/
  main.js           # Navigation, interactions
images/             # Logo, photos, graphics
netlify/
  functions/
    subscribe.js    # Email subscription handler
netlify.toml        # Netlify build + redirect config
daughters-guide.pdf # Downloadable free guide
```
