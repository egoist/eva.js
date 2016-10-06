import EVA from '../../src'
import App from './components/App'
import Home from './views/Home'

const app = new EVA()

app.model({
  state: {count: 0},
  mutations: {
    increment(state) {
      state.count++
    }
  }
})

app.router(route => [
  route('/', Home)
])

app.start(App, '#app')
