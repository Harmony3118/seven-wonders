# seven-wonders

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Structure du projet

**A modifier**

- `main.ts` : point d’entrée. Il démarre Vue et installe les outils globaux, comme le routeur.
- `App.vue` : composant racine, généralement le cadre commun autour des pages.
- `views/` : les pages de l’application, souvent associées à une route. Par exemple, GameView.vue est une page de jeu.
- `components/` : les morceaux d’interface utilisés par une ou plusieurs pages. Une carte affichée à l’écran irait ici.
- `router/` : les URL et la page à afficher pour chacune d’elles.
- `stores/` : l’état partagé et durable de l’application. Dans ton cas, game.ts gère la session de jeu.
- `assets/` : fichiers importés par l’application, comme les feuilles de style et les images. base.css et main.css s’y trouvent déjà.

## Déploiment

- oracle cloud ?
- cloud eirlab ? --> il faut mettre code en libre accès et gérer plusieurs parties en même temps

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
