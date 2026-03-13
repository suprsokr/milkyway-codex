# MilkyWay Codex

An open-source documentation webapp for the **World of Warcraft 3.3.5a** (Wrath of the Lich King) modding community. Browse and search the complete Lua API, events, widgets, data types, CVars, and secure templates extracted from client build 12340.

Built to give addon developers and modders a fast, searchable, and always-available reference — no more digging through outdated wikis or broken archive links.

## Features

- **2,067 API Functions** — full signatures, parameters, return values, and code examples
- **558 Events** — game events with payload parameters and categories
- **38 Widget Types** — methods, inheritance chains, and script handlers
- **449 Console Variables** — CVars with default values and descriptions
- **33 Data Types** — enums and constants used across the API
- **14 Secure Templates** — secure frame templates and attributes
- **Instant Search** — search across all categories from the home page
- **Virtualized Lists** — smooth scrolling through thousands of entries
- **Category Filters** — filter by category, protection status, and more
- **Cross-References** — linked related functions, events, and data types

## Tech Stack

| Component       | Technology                          |
| --------------- | ----------------------------------- |
| Framework       | React 19, TypeScript (strict), Vite |
| Styling         | styled-components 6                 |
| Routing         | React Router v7                     |
| Virtualization  | react-window                        |
| Icons           | lucide-react                        |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `npm run dev`      | Start development server     |
| `npm run build`    | Type-check + production build|
| `npm run lint`     | Run ESLint                   |
| `npm run preview`  | Preview production build     |

## Project Structure

```
src/
├── components/
│   ├── Layout/         # App shell, sidebar navigation
│   └── shared/         # Reusable UI (SearchBar, DataTable, Tag, etc.)
├── features/
│   ├── home/           # Landing page with global search
│   ├── api/            # Game Functions list + detail
│   ├── events/         # Events list + detail
│   ├── widgets/        # Client Functions (widgets) list + detail
│   ├── data-types/     # Data types reference
│   ├── cvars/          # Console variables
│   └── secure-templates/ # Secure frame templates
├── data/               # All reference data (static TypeScript)
├── hooks/              # Shared React hooks
├── theme/              # Design tokens (colors, fonts, radii)
├── styles/             # Global styles
└── types/              # Shared TypeScript interfaces
```

## Data Sources

All data was scraped from archived snapshots of [WoWProgramming.com](https://web.archive.org/web/2010/http://wowprogramming.com/docs) (pre-Cataclysm, before October 12, 2010) and supplemented with data from [Warcraft Wiki](https://warcraft.wiki.gg) and [Wowpedia](https://wowpedia.fandom.com). Memory addresses and internal function mappings were obtained through reverse engineering of the WoW 3.3.5a client (build 12340). No external API calls are made at runtime — everything is statically bundled.

## Contributing

Contributions are welcome! Whether it's fixing a typo, improving a description, or adding undocumented API details — every contribution helps make this reference better for the whole 3.3.5a modding community.

### Verification Badges

Every function and event entry displays a verification badge. This status is **computed automatically** from the data — there is no manual flag to set.

| Badge | Criteria | Meaning |
|-------|----------|---------|
| **Verified** (green) | Real description + memory address in binary OR documentation from a pre-Cataclysm archive snapshot (before Oct 12, 2010) | Confirmed WotLK 3.3.5a information |
| **To review** (orange) | Real description but documentation URL points to a post-WotLK snapshot | Info exists but may differ from the 3.3.5a version |
| **Unverified** (red) | No description or "No documentation available." | Needs community contribution |

### How to Improve an Entry's Status

**Unverified → Verified:**
1. Add a real description to the entry in the corresponding `src/data/*.ts` file
2. Set the `documentationUrl` field to a pre-Cataclysm Wayback Machine snapshot (timestamp before `20101012`)
3. Example: `https://web.archive.org/web/20100701213739/http://wowprogramming.com/docs/api/FunctionName`

**To review → Verified:**
1. Find a pre-Cataclysm snapshot of the same page on the [Wayback Machine](https://web.archive.org)
2. Update `documentationUrl` to use the earlier timestamp
3. Verify the description matches the pre-Cataclysm content

**Adding a memory address** (functions only):
- If you have reverse-engineered WoW.exe build 12340, add the `memoryAddress` field (e.g. `"0x004A2F30"`)
- A function with a memory address + real description is automatically **Verified**, even without a documentation URL

### Data Files

All reference data is in `src/data/`:

| File | Content |
|------|---------|
| `api-functions.ts` | Game API functions (Lua) |
| `events.ts` | Game events |
| `widgets.ts` | UI widget types and methods |
| `data-types.ts` | Enums, flags, and types |
| `cvars.ts` | Console variables |
| `secure-templates.ts` | Secure frame templates |

## License

MIT — use it, fork it, build on it. This project exists to help the WoW modding community.
