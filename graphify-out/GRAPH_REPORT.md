# Graph Report - .  (2026-06-24)

## Corpus Check
- Corpus is ~30,608 words - fits in a single context window. You may not need a graph.

## Summary
- 345 nodes · 359 edges · 29 communities (21 shown, 8 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.84)
- Token cost: 129,340 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Capability Schema Defs|Capability Schema Defs]]
- [[_COMMUNITY_Game Architecture & Design|Game Architecture & Design]]
- [[_COMMUNITY_Permission Schema (Capabilities)|Permission Schema (Capabilities)]]
- [[_COMMUNITY_Desktop Permission Schema|Desktop Permission Schema]]
- [[_COMMUNITY_NPM Package Manifest|NPM Package Manifest]]
- [[_COMMUNITY_Threlte Rendering & Scene|Threlte Rendering & Scene]]
- [[_COMMUNITY_Crossword Data Model (code)|Crossword Data Model (code)]]
- [[_COMMUNITY_macOS Permission Schema|macOS Permission Schema]]
- [[_COMMUNITY_Tech Stack & Citations|Tech Stack & Citations]]
- [[_COMMUNITY_Remote Capability Schema|Remote Capability Schema]]
- [[_COMMUNITY_Tauri App Config|Tauri App Config]]
- [[_COMMUNITY_SDG Content & Levels|SDG Content & Levels]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Default Capability Set|Default Capability Set]]
- [[_COMMUNITY_Framework Logos|Framework Logos]]
- [[_COMMUNITY_App Icon Assets|App Icon Assets]]
- [[_COMMUNITY_Rust Backend (lib.rs)|Rust Backend (lib.rs)]]
- [[_COMMUNITY_HUD & IO Design|HUD & I/O Design]]
- [[_COMMUNITY_Camera Controls (GizmoTrackball)|Camera Controls (Gizmo/Trackball)]]
- [[_COMMUNITY_3D Asset Pipeline|3D Asset Pipeline]]
- [[_COMMUNITY_Svelte Config|Svelte Config]]
- [[_COMMUNITY_Typecheck Gate|Typecheck Gate]]
- [[_COMMUNITY_HTMLCSS Styling|HTML/CSS Styling]]
- [[_COMMUNITY_VS Code Editor|VS Code Editor]]
- [[_COMMUNITY_Figma Design Tool|Figma Design Tool]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 10 edges
2. `Crossworld: A 3D Spatial Crossword Game for Sustainability Awareness and Learning` - 10 edges
3. `definitions` - 9 edges
4. `definitions` - 9 edges
5. `CrosswordGame` - 8 edges
6. `Crossworld project proposal (Thai spec)` - 8 edges
7. `Crossworld Project Proposal` - 8 edges
8. `Storyboard: Time-traveler restoring 7 continents (100 years in future)` - 8 edges
9. `scripts` - 7 edges
10. `Puzzle` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Progressive AI Generation` --semantically_similar_to--> `Words-as-source-of-truth data model`  [INFERRED] [semantically similar]
  documents/output.md → CLAUDE.md
- `HUD (Eco Point, Hint Panel, progress)` --semantically_similar_to--> `Scene/Hud rendering flow`  [INFERRED] [semantically similar]
  documents/output.md → CLAUDE.md
- `Raycasting 3D block selection` --semantically_similar_to--> `interactivity() raycasting`  [INFERRED] [semantically similar]
  documents/output.md → CLAUDE.md
- `Crossworld (3D crossword game)` --references--> `Tauri + SvelteKit + TypeScript template`  [INFERRED]
  CLAUDE.md → README.md
- `3D Crossword core mechanic (X/Y/Z axes)` --conceptually_related_to--> `Crossworld (3D crossword game)`  [INFERRED]
  documents/output.md → CLAUDE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Words-as-source-of-truth puzzle data flow** — claudemd_wordspec, claudemd_buildpuzzle, claudemd_cell, claudemd_crosswordgame [EXTRACTED 0.95]
- **Letter visibility rendering pattern** — claudemd_billboard_text, claudemd_depthwrite_renderorder, claudemd_rendering_flow [EXTRACTED 0.85]
- **AI-driven sustainability content pipeline** — output_progressive_ai_generation, output_content_framework, output_openai_api, output_sustainable_innovation [EXTRACTED 0.85]
- **** — documents_proposal_tauri, documents_proposal_svelte, documents_proposal_threlte_threejs, documents_proposal_typescript, documents_proposal_crossworld_game [EXTRACTED 1.00]
- **** — documents_proposal_level1_north_america, documents_proposal_level2_south_america, documents_proposal_level3_europe, documents_proposal_level4_africa, documents_proposal_level5_asia, documents_proposal_level6_australia, documents_proposal_level7_antarctica [EXTRACTED 1.00]
- **** — documents_proposal_progressive_ai_generation, documents_proposal_content_framework, documents_proposal_typescript, documents_proposal_endless_mode [INFERRED 0.85]

## Communities (29 total, 8 thin omitted)

### Community 0 - "Capability Schema Defs"
Cohesion: 0.05
Nodes (41): description, properties, required, type, Capability, Identifier, default, description (+33 more)

### Community 1 - "Game Architecture & Design"
Cohesion: 0.07
Nodes (33): app.html SvelteKit shell, Billboard Text letters face camera, buildPuzzle() derivation, Cell (derived grid cell), CrosswordGame reactive store, Crossworld (3D crossword game), depthWrite=false + renderOrder=1 fix, Hover-to-reveal clue interaction (+25 more)

### Community 2 - "Permission Schema (Capabilities)"
Cohesion: 0.07
Nodes (31): description, properties, required, type, Capability, Identifier, default, description (+23 more)

### Community 3 - "Desktop Permission Schema"
Cohesion: 0.07
Nodes (28): anyOf, anyOf, description, description, properties, required, type, definitions (+20 more)

### Community 4 - "NPM Package Manifest"
Cohesion: 0.09
Nodes (21): description, devDependencies, svelte, svelte-check, @sveltejs/adapter-static, @sveltejs/kit, @sveltejs/vite-plugin-svelte, @tauri-apps/cli (+13 more)

### Community 5 - "Threlte Rendering & Scene"
Cohesion: 0.11
Nodes (17): $lib/components/Hud.svelte, @threlte/core, @threlte/extras, dependencies, @tauri-apps/api, @tauri-apps/plugin-opener, three, three-viewport-gizmo (+9 more)

### Community 6 - "Crossword Data Model (code)"
Cohesion: 0.17
Nodes (10): CrosswordGame, AXIS_VEC, buildPuzzle(), BuiltPuzzle, cellKey(), samplePuzzle, Axis, Cell (+2 more)

### Community 7 - "macOS Permission Schema"
Cohesion: 0.10
Nodes (20): anyOf, anyOf, description, definitions, Application, Number, PermissionEntry, Target (+12 more)

### Community 8 - "Tech Stack & Citations"
Cohesion: 0.12
Nodes (20): 3D Crossword (Rotatable, X/Y/Z axes), Blender (3D modeling, export glTF/glb), Gee, J.P. (2024). What Video Games Have to Teach Us About Learning and Literacy, Kapp, K.M. (2025). The Gamification of Learning and Instruction, Svelte Documentation (2026), Tauri Framework Docs (2026), Three.js Docs (2026), Threlte Docs (2026) (+12 more)

### Community 9 - "Remote Capability Schema"
Cohesion: 0.11
Nodes (18): description, properties, required, type, CapabilityRemote, type, urls, webviews (+10 more)

### Community 10 - "Tauri App Config"
Cohesion: 0.11
Nodes (17): app, security, windows, build, beforeBuildCommand, beforeDevCommand, devUrl, frontendDist (+9 more)

### Community 11 - "SDG Content & Levels"
Cohesion: 0.12
Nodes (17): Content Framework (word & hint database, AI-Integration API), Eco-Rehabilitation system (level progression: planets in crisis), Endless Mode (Endgame Expansion: procedural alien planets), Level 1: North America (air pollution, transport, smart city / carbon reduction), Level 2: South America (deforestation, biodiversity loss, reforestation), Level 3: Europe (overconsumption, waste, Reduce/Reuse/Recycle/Upcycling), Level 4: Africa (drought, water scarcity, Rainwater/Desalination), Level 5: Asia (industrial air pollution, renewables: Solar/Wind/Geothermal) (+9 more)

### Community 12 - "TypeScript Config"
Cohesion: 0.17
Nodes (11): compilerOptions, allowJs, checkJs, esModuleInterop, forceConsistentCasingInFileNames, moduleResolution, resolveJsonModule, skipLibCheck (+3 more)

### Community 13 - "Default Capability Set"
Cohesion: 0.33
Nodes (5): description, identifier, permissions, $schema, windows

### Community 14 - "Framework Logos"
Cohesion: 0.40
Nodes (6): Svelte (Framework), Svelte Logo, Tauri (Framework), Tauri Logo, Vite (Build Tool), Vite Logo

### Community 15 - "App Icon Assets"
Cohesion: 0.40
Nodes (5): App Icon — 128x128 Variant, App Icon — 32x32 Variant, Crossworld App Icon (Interlocking Rings Logo), App Icon — StoreLogo Variant, Favicon (Default SvelteKit Logo)

### Community 17 - "HUD & I/O Design"
Cohesion: 0.67
Nodes (3): Figma (UI design, interactive prototyping), HUD (Eco Point score, Hint Panel, restoration progress bar), Input/Output Specification (mouse/keyboard controls, audio, dynamic text)

## Knowledge Gaps
- **185 isolated node(s):** `name`, `version`, `description`, `type`, `dev` (+180 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `properties` connect `Permission Schema (Capabilities)` to `Remote Capability Schema`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `definitions` connect `Desktop Permission Schema` to `Capability Schema Defs`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _190 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Capability Schema Defs` be split into smaller, more focused modules?**
  _Cohesion score 0.05121951219512195 - nodes in this community are weakly interconnected._
- **Should `Game Architecture & Design` be split into smaller, more focused modules?**
  _Cohesion score 0.07007575757575757 - nodes in this community are weakly interconnected._
- **Should `Permission Schema (Capabilities)` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `Desktop Permission Schema` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._