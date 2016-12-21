<p align="center">
  <img src="./media/evajs.jpg" /><br><br>
  <br><strong>eva.js</strong> is a complete solution to <br>building modern webs with Vue.js.
</p>

<p align="center">
  <a href="https://npmjs.com/package/eva.js"><img src="https://img.shields.io/npm/v/eva.js.svg?style=flat-square" alt="NPM version"></a>
  <a href="https://npmjs.com/package/eva.js"><img src="https://img.shields.io/npm/dm/eva.js.svg?style=flat-square" alt="NPM downloads"></a>
  <a href="https://circleci.com/gh/egoist/eva.js/tree/master"><img src="https://img.shields.io/circleci/project/egoist/eva.js/master.svg?style=flat-square"></a>
  <a href="https://david-dm.org/egoist/eva.js">
    <img src="https://david-dm.org/egoist/eva.js.svg?style=flat-square" alt="david dm">
  </a>
</p>

## tl;dr

```js
// model
app.model()
// router
app.router()
// bootstrap
app.start()
```

Play with the [JSBin example](http://jsbin.com/laqopo/edit?js,output) or the [simple webpack example](https://github.com/egoist/eva-webpack-simple) 😀

<details><summary>Table of Contents</summary>

<!-- toc -->

- [Sites using eva.js](#sites-using-evajs)
- [Features](#features)
- [Install](#install)
- [Usage](#usage)
- [Concepts](#concepts)
  * [Models](#models)
    + [Top-level model:](#top-level-model)
    + [Namespaced model:](#namespaced-model)
    + [Helpers:](#helpers)
  * [Router](#router)
  * [Views](#views)
- [Vue constructor](#vue-constructor)
- [Access $store and $router outside component](#access-store-and-router-outside-component)
- [Server-side rendering](#server-side-rendering)
- [API](#api)
  * [new EVA([options: object])](#new-evaoptions-object)
    + [options.mode](#optionsmode)
  * [app.model(model: object)](#appmodelmodel-object)
  * [app.router(handler: function)](#approuterhandler-function)
  * [app.use(plugin: function, [options: object])](#appuseplugin-function-options-object)
  * [app.start([App: object], [selector: string])](#appstartapp-object-selector-string)
  * [app.mount(selector)](#appmountselector)
  * [app.syncRouterInStore()](#appsyncrouterinstore)
  * [app.$store](#appstore)
  * [app.$router](#approuter)
  * [app.instance](#appinstance)
- [Development](#development)
- [License](#license)

<!-- tocstop -->

</details>

## Sites using eva.js

Feel free to add your project here!

- [vbuild.js.org](https://vbuild.js.org/) ([source](https://github.com/egoist/vbuild.js.org))
- [vue-play](http://vue-play-button.surge.sh/#/) ([source](https://github.com/egoist/vue-play))

## Features

- Battery included, Vue 2 and its friends (Vuex & Vue-Router)
- Small APIs, just Vue and the official plugins you already play well with!
- Support server-side rendering, of course!
- Inspired by the [choo](https://github.com/yoshuawuyts/choo) framework which is inpired by the [elm architecture](https://guide.elm-lang.org/architecture/)

## Install

```bash
$ npm install --save eva.js
```

In case you may want to use it directly in browser instead, view https://unpkg.com/eva.js/dist/, and add:

```html
<!-- global variable `EVA` is available as a constructor(class) -->
<!-- note that, you should use new EVA.default() to create app instance in browser -->
<script src="/path/to/eva.js"></script>
```

If you use the commonjs version and wanna include the runtime for vue template, follow the [official guide](http://vuejs.org/guide/installation.html#Standalone-vs-Runtime-only-Build):

## Usage

```js
import EVA from 'eva.js'

// Create app instance
const app = new EVA()

// A counter model
app.model({
  state: {count: 0},
  mutations: {
    INCREMENT(state) {state.count++}
  }
})

// A home view
const Home = {
  computed: {
    count() {
      return this.$store.state.count
    }
  },
  render(h) {
    return (
      <div>
        <h1>Home</h1>
        <button on-click={() => this.$store.commit('INCREMENT')}>
          {this.count}
        </button>
      </div>
    )
  }
}

// Apply views to relevant routes
// route(path, view, child_routes)
app.router(route => [
  route('/', Home)
])

// Start app
const App = {
  render(h) {
    return (
      <div id="app">
        <router-view></router-view>
      </div>
    )
  }
}
app.start(App, '#app')
// equal to
// app.start(App)
// app.mount('#app')
```

## Concepts

### Models

A model contains it's initial state and the methods you use to update its state, in fact, it's a typical Vuex module too.

#### Top-level model:

```js
// An app instance only have at most one top-level model
app.model({
  state: {count: 0},
  mutations: {
    INCREMENT(state) {state.count++}
  }
})
```

#### Namespaced model:

```js
// An app could have multiple namespaced models
app.model({
  name: 'user',
  state: {login: false},
  mutations: {
    LOG_IN(state) {state.login = true}
  }
})
```

> In most cases using namespaces is beneficial, as having clear boundaries makes it easier to follow logic.

#### Helpers:

As how you use Vuex^2, you can use its helpers too:

```js
const {mapState, mapActions, mapGetters} = require('eva.js')
// or ES6 modules
import {mapState, mapActions, mapGetters} from 'eva.js'
```

### Router

The router could render the component which matches the URL path. It has a `route` helper for creating an actual route object used in `vue-router`. routes are passed in as a nested array.

```js
app.router(route => [
  route('/', Home),
  route('/settings', Settings, [
    route('/profile', SettingsProfile),
    route('/password', SettingsPassword)
  ])
])

// use an object as route argument:
route({path: '/', component: Home, /*...*/})

// use an object as router argument:
app.router({
  mode: 'history',
  routes: []
})
```

[The router state is effortlessly synced in vuex store.](https://github.com/vuejs/vuex-router-sync#how-does-it-work)

### Views

A view is a simple Vue component, that easy :)

## Vue constructor 

If you wan to access Vue constructor directly, simply do:

```js
import {Vue} from 'eva.js'

Vue.use(yourPlugin)
```

## Access $store and $router outside component

You can initialize your app and bootstrap it later:

```js
// ./src/app.js
import EVA from 'eva.js'

const app = new EVA()

app.model() //...
app.router() //...

export default app.start()

// ./src/index.js
import app from './app'
app.mount('#app')

// ./some/other/file.js
import app from './path/to/src/app.js'

app.$router.push('/somewhere')
```

## Server-side rendering

Similar to the official [hackernews example](https://github.com/vuejs/vue-hackernews-2.0/blob/master/src/app.js):

```js
// ./src/app.js
import EVA from 'eva.js'
import App from './App.vue'

const app = new EVA()

export default app.start(App)
// without selector!
// otherwise it will be mounted to the selector
```

Then for the `server-entry.js`:

```js
// ./src/server-entry.js
import app from './app'

export default context => {
  // you can access app.$router / app.$store
  return Promise.all(operations)
    .then(() => {
      return app.instance
    })
}
```

For `client-entry.js`:

```js
import app from './app'

app.mount('#app')
```

## Promise polyfill

Some browsers do not have native Promise, like IE, but `vuex` requires Promise. Thus `eva.js` provides an lightweight Promise polyfill with [promise-polyfill](https://github.com/taylorhakes/promise-polyfill).

```js
import 'eva.js/promise-polyfill'
import EVA from 'eva.js'
// ... your app code
```

## API

### new EVA([options: object])

Create an app instance.

#### options.mode

The router mode, can be either `hash` *(default)* or `history`.

### app.model(model: object)

Register a model, a.k.a. store module in Vuex. You can omit the `name` property to make it top-level.

### app.router(handler: function)

Register routes.

### app.use(plugin: function, [options: object])

The same as `Vue.use`, you can apply any Vue plugin.

### app.start([App: object], [selector: string])

Create app instance. Optionally mount App component to a domNode if selector is defined.

If App is not specified, we use a default value:

```js
const defaultApp = {
  render(h) {
    return <div id="app"><router-view></router-view></div>
  }
}
```

If selector is not specified, we won't mount the app instance to dom.

### app.mount(selector)

Mounted app instance to dom, must be call after `app.start([App])` (without `selector` argument). Default `selector` is `#app`

### app.syncRouterInStore()

keep vue-router and vuex store in sync, i.e. keep router state in vuex store.

The method will be called automatically in `app.start()`, you can also call it manually before `app.start()` and `app.start()` won't call it again.

### app.$store

The vuex store instance.

### app.$router

The vue-router instance.

### app.instance

The Vue instance created by `app.start()`, most likely you will use this in [server-side rendering](#server-side-rendering).

## Development

```bash
# build and watch source files
$ npm run watch

# launch server for simple html example
$ http-server .
# run webpack example
$ npm run webpack

# build for publish to npm
# cjs and umd and compressed umd
$ npm run build
```

## License

MIT &copy; [EGOIST](https://github.com/egoist)
