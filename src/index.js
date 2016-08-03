import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

Vue.use(VueRouter)
Vue.use(Vuex)

class EVA {
  constructor(initialStore = {}) {
    this.routes = []
    this.store = new Vuex.Store(initialStore)
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
      mode: 'history',
      base: location.pathname
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
