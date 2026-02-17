# Diverse Feestdagen

Een professionele Vue applicatie voor het weergeven van diverse internationale feestdagen op schoolinformatieborden en andere digitale schermen.

## 🎯 Doel van het project

Deze applicatie is speciaal ontwikkeld om scholen te helpen bij het tonen van een breed scala aan feestdagen en festiviteiten op hun informatieborden. Door verschillende culturen en tradities te belichten, wordt inclusiviteit en cultureel bewustzijn bevorderd binnen de schoolgemeenschap.

Perfect voor:
- Schoolinformatieborden
- Digitale schermen in het onderwijs
- Kantine- en ontvangstschermen
- Diversiteit- en inclusieprojecten

## 📋 Voor scholen: Fork dit project

**Wil je dit project gebruiken op jouw school?** Fork dit repository en pas het aan naar jouw behoeften!

### Data aanpassen

Alle feestdagen worden opgeslagen in JSON-formaat in [`public/holidays.json`](public/holidays.json). Je hebt twee opties:

#### Optie 1: Direct JSON bewerken
- Bewerk [`public/holidays.json`](public/holidays.json) handmatig met jouw gewenste feestdagen
- Gebruik dezelfde structuur als de bestaande data

#### Optie 2: Google Sheets gebruiken (aanbevolen)
1. **Download de huidige data**: [CSV downloaden van Google Sheets](https://docs.google.com/spreadsheets/d/e/2PACX-1vTvwLO6NO51LURc7ODdJuil6zhKV9J6SkWmU8AJ8IWd0ohXCFyB4XbBtDUrbi0bU2jnBmHAk4qNf6aP/pub?gid=1763869494&single=true&output=csv)
2. Maak een kopie van deze data in je eigen Google Sheets
3. Pas de feestdagen aan naar jouw wensen
4. **Belangrijk**: Maak je Google Sheet publiek toegankelijk met CSV export
5. Update de `CSV_URL` in [`scripts/import-holidays.js`](scripts/import-holidays.js) naar jouw Google Sheets URL
6. Run `npm run import-holidays` om de data te importeren

### Hulp nodig?

**Vragen of problemen?** Aarzel niet om [een issue aan te maken](https://github.com/JonasVoorzanger/DiverseFeestdagen/issues/new/choose) - we helpen graag mee bij het opzetten voor jouw school!

## 🛠 Technologieën

- Vue 3 met Options API
- Vuetify 3 (Material Design framework)
- Pug templating
- Vite (build tool)
- GitHub Pages deployment

## 📊 Data Import

De feestdagen worden geïmporteerd van een Google Sheets CSV. Het huidige sheet bevat een diverse collectie van internationale feestdagen.

```bash
npm run import-holidays
```

Dit script:
- Haalt de data op van de Google Sheets CSV
- Converteert naar JSON formaat
- Slaat op in [`public/holidays.json`](public/holidays.json)
- Wordt automatisch uitgevoerd voor elke build (via `prebuild` script)

**Huidige data bron:** [Google Sheets CSV](https://docs.google.com/spreadsheets/d/e/2PACX-1vTvwLO6NO51LURc7ODdJuil6zhKV9J6SkWmU8AJ8IWd0ohXCFyB4XbBtDUrbi0bU2jnBmHAk4qNf6aP/pub?gid=1763869494&single=true&output=csv)

## 🚀 Installatie

```bash
npm install
```

## 💻 Development

Start de development server:

```bash
npm run dev
```

De applicatie is beschikbaar op `http://localhost:5173`

**Let op:** Run eerst `npm run import-holidays` om de feestdagen data te laden.

## 📦 Build voor productie 

```bash
npm run build
```

Het `prebuild` script zorgt ervoor dat de holidays data automatisch wordt geïmporteerd voor elke build.

## 👀 Preview productie build

```bash
npm run preview
```

## 🚀 Deployment naar GitHub Pages

De applicatie wordt automatisch gedeployed naar GitHub Pages bij elke push naar de `main` branch via GitHub Actions.

### Handmatige configuratie vereist:

1. Ga naar je GitHub repository settings
2. Navigeer naar **Settings > Pages**
3. Onder "Build and deployment" > "Source", selecteer **GitHub Actions**

De website zal beschikbaar zijn op: `https://<username>.github.io/DiverseFeestdagen/`

## 🌐 CORS

De applicatie is geconfigureerd met open CORS headers, zodat de content door iedereen gebruikt kan worden.

## ✨ Features

- Overzicht van verschillende feestdagen uit verschillende culturen
- Zoekfunctionaliteit
- Responsive design met Vuetify
- Material Design iconen voor verschillende categorieën
- Pug templating voor cleane templates
- Automatische datumsortering
- Kleurcodering per categorie
- Auto-reload functionaliteit voor schermen

## ⚙️ URL Parameters

De applicatie ondersteunt verschillende URL parameters om het gedrag aan te passen:

### Auto-reload

Voeg `?reload=10` toe aan de URL om de pagina automatisch elke 10 minuten te verversen:

```
https://username.github.io/DiverseFeestdagen/?reload=10
```

- De waarde staat voor minuten tussen elke reload
- Standaard: 60 minuten (als geen parameter opgegeven is)
- Bijvoorbeeld: `?reload=5` voor elke 5 minuten

### Andere parameters

- `n` - Aantal feestdagen om te tonen (standaard: 5)
- `lookup` - Schakel naar lookup mode (`?lookup=true`)
- `types` - Filter op type(n) (`?types=Algemeen,Fun`)
- `search` - Zoek op naam (`?search=kerst`)
- `showPast` - Toon verleden feestdagen (`?showPast=true`)

Parameters kunnen gecombineerd worden met `&`:
```
?reload=10&n=8&lookup=true
```

## 🤝 Bijdragen

Dit project is open source en verwelkomt bijdragen van scholen en ontwikkelaars. Voel je vrij om:

- Issues aan te maken voor vragen of suggesties
- Pull requests in te dienen voor verbeteringen
- Je eigen schoolspecifieke aanpassingen te delen

## 📄 Licentie

Open source - vrij te gebruiken voor onderwijsdoeleinden en andere non-profit toepassingen.