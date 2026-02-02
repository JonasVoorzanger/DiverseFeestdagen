# Diverse Feestdagen

Een eenvoudige Vue applicatie met Vuetify en Pug templating voor het weergeven van diverse feestdagen.

## Technologieën

- Vue 3 met Options API
- Vuetify 3 (Material Design framework)
- Pug templating
- Vite (build tool)
- GitHub Pages deployment

## Data Import

De feestdagen worden geïmporteerd van een Google Sheets CSV. Voor het bouwen:

```bash
npm run import-holidays
```

Dit script:
- Haalt de data op van de Google Sheets CSV
- Converteert naar JSON formaat
- Slaat op in `public/holidays.json`
- Wordt automatisch uitgevoerd voor elke build (via `prebuild` script)

## Installatie

```bash
npm install
```

## Development

Start de development server:

```bash
npm run dev
```

De applicatie is beschikbaar op `http://localhost:5173`

**Let op:** Run eerst `npm run import-holidays` om de feestdagen data te laden.

## Build voor productie

```bash
npm run build
```

Het `prebuild` script zorgt ervoor dat de holidays data automatisch wordt geïmporteerd voor elke build.

## Preview productie build

```bash
npm run preview
```

## Deployment naar GitHub Pages

De applicatie wordt automatisch gedeployed naar GitHub Pages bij elke push naar de `main` branch via GitHub Actions.

### Handmatige configuratie vereist:

1. Ga naar je GitHub repository settings
2. Navigeer naar **Settings > Pages**
3. Onder "Build and deployment" > "Source", selecteer **GitHub Actions**

De website zal beschikbaar zijn op: `https://<username>.github.io/DiverseFeestdagen/`

## CORS

De applicatie is geconfigureerd met open CORS headers, zodat de content door iedereen gebruikt kan worden.

## Features

- Overzicht van verschillende feestdagen
- Zoekfunctionaliteit
- Responsive design met Vuetify
- Material Design iconen
- Pug templating voor cleane templates

## Licentie

Open source - vrij te gebruiken
