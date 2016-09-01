import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import assign from 'object-assign'

Vue.use(VueRouter)
Vue.use(Vuex)

class EVA {
  constructor(options = {}) {
    if (!(this instanceof EVA)) {
      return new EVA(options)
    }
    this.routes = []
    this.options = options
    this.storeInstance = new Vuex.Store(this.options.store)
  }
  model(name, m) {
    this.storeInstance.registerModule(name, m)
  }
  route(path, component, children) {
    return {
      path,
      component,
      children
    }
  }
  router(handleRoute) {
    this.routes = handleRoute(this.route)
  }
  start(app, mountTo) {
    this.routerInstance = new VueRouter({
      routes: this.routes,
      mode: this.options.mode
    })
    this.vm = new Vue(assign({
      store: this.storeInstance,
      router: this.routerInstance
    }, app))
    this.vm.$mount(mountTo)
  }
}

export default EVA
