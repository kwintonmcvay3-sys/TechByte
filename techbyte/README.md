# TechByte Advisor

**AI PC Parts & Support** for office workers on a budget, gamers, and small businesses in Oklahoma and the Midwest.

TechByte Advisor is a browser web app with four sections:

| Section | What it does |
|---|---|
| **Advisor** | A help desk chatbot. It recommends full PC builds from a parts catalog and explains every part, walks customers through computer problems, and helps with files (deleted, lost, backups, transfers). |
| **Workflow** | A Zapier-style workflow that runs on every customer message: a trigger and five actions (sort, search, answer, ticket, follow-up), each passing its result to the next step. Includes a ticket log and a follow-up message draft. |
| **Build Simulator** | A small game. Pick a mission, install parts on a virtual bench, and press Power on. A startup screen checks each part in order, explains failures, and awards up to three stars. |
| **Instructions and Knowledge** | Shows the chatbot's instructions and knowledge file, and lets you edit and test them in the browser. |

No build step, no install, and no server. It is plain HTML, CSS, and JavaScript.

## Run it

**On your computer:** download the repo and open `index.html` in a web browser.

**On GitHub Pages:**

1. Push this folder to a new GitHub repository.
2. Open the repository's **Settings**, then **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose the `main` branch and the `/ (root)` folder, then save.
4. After a minute or two, the site address appears at the top of the Pages screen.

## Project files

```
techbyte/
  index.html         Page layout and styles
  app.js             Chat, workflow, simulator, and editor
  data.js            Parts catalog, tested builds, compatibility checks, simulator scoring
  instructions.js    The chatbot's instructions (rules and tone)
  knowledge.js       The knowledge file (help articles)
  assets/logo.png    TechByte logo
```

## Customize the chatbot

**Instructions:** edit the text inside `instructions.js`. This sets the chatbot's role, troubleshooting method, safety rules, and when to send a ticket to a technician.

**Knowledge file:** add or edit articles in `knowledge.js`. Each article looks like this:

```js
{
  "id": "no-power",
  "type": "hardware",            // "hardware" or "files"
  "title": "The PC will not turn on",
  "keywords": ["wont turn on", "no power"],
  "steps": ["Check the power cable...", "Try a different outlet..."],
  "replace": { "part": "psu_750", "note": "A failed power supply is replaced, never opened." },
  "open": false,                 // true adds the "unplug before opening the case" warning
  "source": "Core 1 guide, 5A: No Power"
}
```

The chatbot matches the customer's message against `keywords`. Longer phrases count for more.

**Parts and prices:** edit the `P` catalog and the `TIERS` builds in `data.js`.

> Edits made on the Instructions and Knowledge page save only in that one browser. To change the app for everyone, edit the files and push them to GitHub.

## Two answer modes

- **Guided mode** (default): answers come from the knowledge file and the tested builds in `data.js`. Works everywhere, including GitHub Pages.
- **Live AI mode:** when the app runs as a Claude artifact on claude.ai, typed questions are answered by Claude using `instructions.js`, `knowledge.js`, and the catalog. Outside claude.ai the app stays in guided mode automatically.

## Notes

- Prices are sample estimates from November 2026. Memory and storage prices are changing quickly, so check a live listing before buying.
- Simulator scores are estimates on a 0 to 100 scale, not real benchmarks.
- Tickets live only in the open page and clear when it reloads.
- Help articles follow the CompTIA A+ Core 1 (220-1201) and Core 2 (220-1202) troubleshooting topics.

## Team

| Role | Responsibility |
|---|---|
| Project Manager | Schedule, check-ins, scope decisions |
| Part Researcher | Catalog accuracy: prices, sockets, memory types, wattage |
| Builder | Builds and updates the app |
| Tester and Writer | Tests customer scenarios, logs bugs, writes the docs and presentation |

Built by the TechByte team, Douglass Tech Pathway, with Between Two Divs.
