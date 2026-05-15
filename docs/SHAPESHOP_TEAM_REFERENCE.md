# ShapeShop prototype — team build reference

This document turns the ShapeShop plan into **parallel workstreams** so one group can build **up from the foundation** while another builds **down from the shell**, and you **meet in the middle** at shared contracts before pushing to GitHub.

**Source plan (authoritative detail):**  
`build_shapeshop_prototype_d2ae5c41.plan.md` in your local Cursor plans folder (e.g. `.cursor/plans/` on the machine where the plan was created). This file does **not** replace that plan; it coordinates people and merge order.

**Product goal:** Next.js (App Router) + TypeScript + Tailwind + React Three Fiber prototype: pick a base shape, explore 3D transforms, browse mock products, mock checkout (“Shape Now”), optional profile — structured so **Amplify Gen 2** can be wired later (skeleton only, no AWS required for MVP).

---

## Current baseline (repo)

- **Done:** Scaffold — Next.js at repo root, TypeScript, Tailwind, ESLint, `src/`, Three.js + R3F + Drei installed (`npm run dev` / `npm run build`).
- **Remaining:** Types, mock data, context, pages, components, polish, Amplify placeholder files (see plan sections 3–11).

---

## Meet-in-the-middle strategy

| Stream | Direction | Owns (first) | Converges on |
|--------|-----------|----------------|--------------|
| **A — Foundation** | Bottom → up | Types, mock data, `utils`, context **API** (types + Provider shape), Amplify skeleton | Components import **types + data + hooks**; no UI polish required early |
| **B — Shell & UX** | Top → down | `globals.css` tokens, fonts, `Navbar`, route stubs, `ShapeIcon`, layout polish | Pages and components consume **stable URLs + CSS variables/class names**; can use **temporary hardcoded** data until Stream A lands |

**Integration milestone (“the middle”):** A short-lived **integration branch** or sequence of small PRs where:

1. **Types + data** are on `main` (or a `feat/shapeshop-data` branch merged first).
2. **Context** exposes a **frozen contract** (state fields + action names below) so Stream B can replace hardcoded mocks with `useApp()` (or whatever you name it).
3. **Pages** switch from placeholders to real components one route at a time.

Avoid two people editing the same file without pairing — use the **file ownership** table below.

---

## Frozen contracts (agree before splitting work)

### Routes and query params

| Route | Purpose |
|-------|--------|
| `/` | Landing: hero + `ShapePicker` |
| `/explore` | `ShapeExplorer3D` + transform tabs |
| `/products` | Product grid; filter `?shape=circle` and `?shape=circle&transform=sphere` |
| `/profile` | `ProfileForm` |
| `/checkout/[orderId]` | `CheckoutConfirmation` |

**Query naming:** `shape` = base `ShapeName` (`circle` \| `square` \| `triangle` \| `rectangle` \| `hexagon`). `transform` = slug or key aligned with mock data (team should pick one convention in `src/data/shapes.ts` and stick to it).

### Context (planned surface)

Align with the plan; names can vary but **keep this shape** so merges are boring:

- **State:** `selectedShape`, `selectedTransform`, `profile` (nullable), `orders[]`
- **Actions:** `setShape`, `setTransform`, `setProfile`, `placeOrder`

Stream A implements; Stream B may stub with `useState` locally until the Provider exists.

### Domain types (summary)

`ShapeName`, `UserProfile`, `ShapeTransformation`, `Shape`, `Product`, `Order` — full definitions in the source plan (section 4). **Stream A** owns `src/types/index.ts` as the single source of truth.

---

## Suggested parallel backlog

### Stream A — Foundation (dependency order)

1. `src/types/index.ts` — all exported types.
2. `src/data/shapes.ts` — five shapes, 2–3 transforms each (see plan section 5).
3. `src/data/products.ts` — ~18 products, placeholder images (`placehold.co` or inline SVG).
4. `src/lib/utils.ts` — `formatPrice`, `generateId`, any URL/query helpers.
5. `src/lib/context.tsx` — Provider + hook; in-memory only.
6. `amplify/*` — commented placeholders only (**no** Amplify npm install for MVP per plan).

**Merge checkpoint A1:** Types + data + utils merged → everyone pulls before building components that read catalog or shapes.

**Merge checkpoint A2:** Context merged → pages/components switch from local stub state to context.

### Stream B — Shell & presentation (can start early)

1. `src/app/globals.css` — shape gradient tokens, keyframes (float, etc.).
2. `src/app/layout.tsx` — font (`next/font`), wrap with Provider **after** Stream A adds it (until then, optional no-op wrapper).
3. `src/components/Navbar.tsx` — links to all routes above.
4. `src/components/ShapeIcon.tsx` — SVGs for five base shapes.
5. Route **stubs** under `src/app/explore/page.tsx`, `products/page.tsx`, `profile/page.tsx`, `checkout/[orderId]/page.tsx` with clear “TODO: wire component” and static copy.

**Merge checkpoint B1:** Navbar + globals + icons merged → landing/explore can focus on composition, not chrome.

### Middle — feature verticals (after A1 + B1)

Split by **route** or **component file** to reduce conflicts:

| Vertical | Primary files | Depends on |
|----------|----------------|------------|
| Landing | `page.tsx`, `ShapePicker.tsx` | A1, B1; optional A2 for syncing selection |
| Explore | `explore/page.tsx`, `ShapeExplorer3D.tsx` | A1, A2, R3F |
| Products | `products/page.tsx`, `ProductCard.tsx` | A1, A2 |
| Checkout | `ShapeNowButton.tsx`, `checkout/...`, `CheckoutConfirmation.tsx` | A2, products |
| Profile | `profile/page.tsx`, `ProfileForm.tsx` | A2 |

**Polish** (motion, responsive, a11y pass) — last shared PR or rotation so it does not fight feature PRs.

---

## File ownership (minimize merge pain)

| Path / area | Primary owner |
|-------------|----------------|
| `src/types/index.ts` | Stream A |
| `src/data/*.ts` | Stream A |
| `src/lib/context.tsx`, `src/lib/utils.ts` | Stream A |
| `src/app/globals.css`, fonts in `layout.tsx` | Stream B (coordinate with A for Provider insertion) |
| `src/components/Navbar.tsx`, `ShapeIcon.tsx` | Stream B |
| One route `page.tsx` per person | By vertical (see table) |
| `amplify/**` | Stream A (end) or dedicated small PR |

---

## GitHub / PR hygiene (before push)

1. **Branch naming:** e.g. `feat/shapeshop-types`, `feat/shapeshop-explore`, `feat/shapeshop-context`.
2. **Small PRs:** Prefer A1 (types+data) → B1 (nav+styles) → verticals; avoid one mega-PR.
3. **Definition of done per PR:** `npm run lint` and `npm run build` pass locally.
4. **Conflicts:** Rebase after A1 lands; components should import from `src/types` and `src/data`, not duplicate literals.
5. **README:** Replace or extend root `README.md` with run instructions (`npm install`, `npm run dev`) when the app is demo-ready (plan originally replaced README; current repo has CRA-style Next README — update when you go public).

---

## Commands (reference)

```bash
npm install
npm run dev
npm run build
npm run lint
```

3D stack (already installed): `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`.

---

## Plan ↔ doc map

| Plan section | Topic |
|--------------|--------|
| 3 | Target folder layout |
| 4–5 | Types and mock data |
| 6 | Component behaviors |
| 7 | Context |
| 8 | Routes |
| 9 | Visual design |
| 10 | Amplify skeleton (comments only) |
| 11 | Linear build order (use alongside **parallel** table above) |

When in doubt, match the **source plan** file, not this summary.
