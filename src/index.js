import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

Vue.use(VueRouter)
Vue.use(Vuex)

class EVA {
  constructor(options = {}) {
    this.routes = []
    this.options = options
    this.store = new Vuex.Store(this.options.store)
  }
  model(name, m) {
    this.store.module(name, m)
  }
  view(path, v) {
    this.routes.push({
      path,
      ...v
    })
  }
  start(app, mountTo) {
    this.router = new VueRouter({
      routes: this.routes,
      mode: this.options.mode
    })
    this.vm = new Vue({
      store: this.store,
      router: this.router,
      ...app
    })
    this.vm.$mount(mountTo)
  }
}

export default EVA
