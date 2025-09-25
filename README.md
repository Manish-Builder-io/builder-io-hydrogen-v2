# Hydrogen template: Skeleton

Hydrogen is Shopify’s stack for headless commerce. Hydrogen is designed to dovetail with [Remix](https://remix.run/), Shopify’s full stack web framework. This template contains a **minimal setup** of components, queries and tooling to get started with Hydrogen.

[Check out Hydrogen docs](https://shopify.dev/custom-storefronts/hydrogen)
[Get familiar with Remix](https://remix.run/docs/en/v1)

## What's included

- Remix
- Hydrogen
- Oxygen
- Vite
- Shopify CLI
- ESLint
- Prettier
- GraphQL generator
- TypeScript and JavaScript flavors
- Minimal setup of components and routes

## Getting started

**Requirements:**

- Node.js version 18.0.0 or higher

```bash
npm create @shopify/hydrogen@latest
```

## Building for production

```bash
npm run build
```

## Local development

```bash
npm run dev
```

## Setup for using Customer Account API (`/account` section)

Follow step 1 and 2 of <https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api/hydrogen#step-1-set-up-a-public-domain-for-local-development>

## Builder.io Integration

### 1) Install

Already added: `@builder.io/sdk-react`.

### 2) Environment variables

Set your Builder Public API Key (either works; first is preferred):

```
PUBLIC_BUILDER_API_KEY=your_public_key
VITE_PUBLIC_BUILDER_KEY=your_public_key
```

Restart dev server after changes.

### 3) Routes

- Live pages (cached): `app/routes/($slug)._index.tsx`
  - Resolves Builder content by `urlPath` (e.g., `/about`).
  - Uses `PUBLIC_BUILDER_API_KEY` or `VITE_PUBLIC_BUILDER_KEY`.

- Preview pages (no cache): `app/routes/preview.$slug.tsx`
  - URL: `/preview/:slug` (e.g., `/preview/about`).
  - Accepts preview params from Builder links, including `builder.publicApiKey` and `builder.space`.

### 4) Client routing for links

Both routes pass a React Router `Link` via `linkComponent` to support client-side navigation.

### 5) Custom components

- Registry: `builder-registry.ts`
- Included components:
  - `Counter`
  - `Hero` (props: `title`, `subtitle`, `imageUrl`, `ctaText`, `ctaHref`, `align`)
  - `ProductCard` (props: `title`, `imageUrl`, `price`, `compareAtPrice`, `href`)
- Both routes pass `customComponents` to the Builder `<Content />` component.

### 6) CSP (Content Security Policy)

The server adds Builder allowances in `app/entry.server.tsx` so images and tracking work in dev:
- `img-src`: `'self'` `data:` `blob:` `https://cdn.builder.io` Shopify domains and `http://localhost:*`
- `connect-src`: `https://cdn.builder.io` `https://cdn.builder.codes`

If you deploy to Oxygen or another host, ensure your platform forwards these CSP headers or config matches.

### 7) Creating content in Builder

- Use model `page` (default in code). If you use a different model, change `model` constant in both routes.
- Ensure the entry `URL` matches your site path (e.g., `/about`). For preview, the path is `/preview/about`.
- For Dynamic Preview URLs (optional), add a `slug` custom field in your model and drive the preview URL with it.

### 8) Troubleshooting

- 404 on live page: confirm model name, API key, and that entry URL matches path.
- Missing images: confirm CSP, and that the image is accessible from `cdn.builder.io`.
- Preview not loading: include preview params from Builder link or set `PUBLIC_BUILDER_API_KEY`.
