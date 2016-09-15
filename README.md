<p align="center">
  <br><strong>eva.js</strong> is a complete solution to <br>building modern webs with Vue.js.
</p>

<p align="center">
  <a href="https://npmjs.com/package/eva.js"><img src="https://img.shields.io/npm/v/eva.js.svg?style=flat-square" alt="NPM version"></a>
  <a href="https://npmjs.com/package/eva.js"><img src="https://img.shields.io/npm/dm/eva.js.svg?style=flat-square" alt="NPM downloads"></a>
  <img src="https://img.shields.io/badge/stability-experimental-yellow.svg?style=flat-square">
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

## Features

- Battery included, Vue 2 and its friends (Vuex & Vue-Router)
- Inspired by the [choo](https://github.com/yoshuawuyts/choo) framework which is inpired by the [elm architecture](https://guide.elm-lang.org/architecture/)

## Install

```bash
$ npm install --save eva.js
```

## Usage

```js
import eva from 'eva.js'

// create app instance
const app = eva()

// a counter model
app.model({
  state: {count: 0},
  mutations: {
    INCREMENT(state) {state.count++}
  }
})

// a home route
const Home = {
  computed: {
    count() {
      return this.$store.state.count
    }
  },
  render(h) {
    return h(
      'div',
      [
        h('h1', 'Home'),
        h('button', {
          on: {click: () => this.$store.commit('INCREMENT')}
        }, this.count)
      ]
    )
  }
}

app.router(route => [
  route('/', Home)
])

// start app
const App = {
  render(h) {
    return (
      h(
        'div',
        {attrs: {id: 'app'}},
        [
          h('router-view')
        ]
      ),
    )
  }
}
app.start(App, '#app')
```

## License

MIT &copy; [EGOIST](https://github.com/egoist)
