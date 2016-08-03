## Usage

```js
import EVA from 'eva.js'

const app = new EVA()

// a counter model
app.model('counter', {
  state: {count: 0},
  mutations: {
    INCREMENT(state) {state.count++}
  }
})

// a home route
const Home = {
  computed: {
    count() {
      return this.$store.state.counter.count
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
app.view('/', {
  component: Home
})

// start app
const App = {
  render(h) {
    return (
      h('div', {attrs: {id: 'app'}}),
      [
        h('router-view')
      ]
    )
  }
}
app.start(App, '#app')
```

## License

MIT &copy; [EGOIST](https://github.com/egoist)
