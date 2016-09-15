import Vue from 'RESOLVE_VUE'
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
  }
  use(...args) {
    Vue.use(...args)
  }
  model(name, m) {
    // initial store instance
    if (!this.storeInstance) {
      if (typeof name === 'string') {
        // to register a namespaced model
        // therefore no initial model
        this.storeInstance = new Vuex.Store()
      } else {
        // to register a initial model
        // `name` is the model here
        this.storeInstance = new Vuex.Store(name)
      }
    }
    
    // once the store intance is initialized
    // you can add a initial model again
    // only namespaced model is allowed
    if (typeof name === 'string') {
      this.storeInstance.registerModule(name, m)
    }
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

EVA.mapState = Vuex.mapState
EVA.mapActions = Vuex.mapActions
EVA.mapGetters = Vuex.mapGetters

export default EVA
