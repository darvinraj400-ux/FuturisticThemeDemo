# NEXUS ∞ — Beyond the Interface

A next-generation futuristic website with immersive 3D, reactive UI, cinematic motion, and experimental interactions. Built as a speculative interface laboratory set in the year 2085.

## Overview

NEXUS ∞ is not an ordinary technology company website. It is an interactive environment where visitors explore futuristic technologies, manipulate digital materials, customize interface behavior, navigate spatial interfaces, and discover what a more advanced relationship between humans and technology could feel like.

## Features

### 🌟 Signature Hero Experience
- Interactive 3D crystalline artifact powered by Three.js and React Three Fiber
- Responds to pointer movement with smoothed perspective changes
- Visual mode selector (Quantum, Holographic, Monolithic, Aurora)
- Core state control (Dormant, Active, Transcendent)
- Cinematic intro animation

### 🔬 Technology Explorer
Four distinct interactive demonstrations:
- **SYNAPSE** — Interactive network diagram with animated connections
- **PRISM** — Visual information processing with multiple modes
- **ATLAS** — Autonomous network with route generation
- **LUMEN** — Adaptive environment with mood presets

### 🎛️ Interface Lab
Full customization workspace with:
- Visual mode selection
- Accent color picker
- Motion intensity control (Still, Balanced, Kinetic)
- Depth and transparency sliders
- Geometry selection
- Preset configurations
- Save/load functionality with localStorage persistence

### 🌐 Spatial Mode
Immersive 3D environment featuring:
- Interactive orbital camera controls
- Selectable objects with descriptions
- Atmospheric particles and lighting
- Object list navigation
- WebGL fallback for unsupported browsers

### 📚 Archive
Curated collection of experiments:
- 10 unique experiments with procedural artwork
- Full-text search
- Category filtering
- Detail view with configuration parameters
- Load experiments into Interface Lab
- Save to collection

### ⌨️ Command Palette
- Trigger with `Ctrl/Command + K`
- Navigate sections, change modes, reset settings
- Keyboard navigation with arrow keys
- Fuzzy search across all commands

## Technical Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS v4** for styling
- **Framer Motion** for UI animations
- **Three.js** + **React Three Fiber** + **Drei** for 3D graphics
- **Lucide React** for icons
- **React Router** for navigation

## Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Void | `#07080D` | Primary background |
| Obsidian | `#10121A` | Secondary surfaces |
| Graphite | `#191C27` | Tertiary surfaces |
| Frost | `#F1F4FA` | Primary text |
| Silver | `#9299AD` | Secondary text |
| Cyan | `#65F4FF` | Active interaction |
| Ultraviolet | `#A477FF` | Experimental modes |
| Lime | `#C9FF64` | Confirmation |
| Coral | `#FF6B79` | Warnings |

### Typography
- **Display:** Space Grotesk
- **Body:** Inter
- **Mono:** JetBrains Mono

### Motion Tokens
- Micro-motion: 150ms
- Component motion: 350ms
- Cinematic motion: 800ms

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Accessibility

- Semantic HTML with proper landmarks
- Keyboard-accessible navigation and controls
- Visible focus states
- `prefers-reduced-motion` support
- Screen reader-friendly status announcements
- Sufficient text contrast ratios
- Touch targets ≥ 44×44 CSS pixels
- WebGL fallbacks for 3D content

## Browser Support

- Modern browsers with WebGL support (Chrome, Firefox, Safari, Edge)
- Graceful degradation for browsers without WebGL
- Mobile-first responsive design (320px+)
- Respects `prefers-reduced-motion`

## Architecture

```
src/
├── App.tsx              # Application shell, routing, state provider
├── store.ts             # Types, data, context, configuration
├── index.css            # Design tokens, global styles, utilities
├── main.tsx             # Entry point
├── components/
│   └── Navigation.tsx   # Desktop & mobile navigation
└── features/
    ├── Hero.tsx          # Opening scene with 3D NEXUS Core
    ├── Technologies.tsx  # Four technology demonstrations
    ├── InterfaceLab.tsx  # Customization workspace
    ├── SpatialMode.tsx   # 3D spatial environment
    ├── Archive.tsx       # Experiment collection
    └── CommandPalette.tsx # Command palette (⌘K)
```

## License

Fictional project for demonstration purposes. © 2085 NEXUS Laboratories.
