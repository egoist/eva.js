import Vue from 'RESOLVE_VUE' // eslint-disable-line import/no-extraneous-dependencies
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import assign from 'object-assign'

Vue.use(VueRouter)
Vue.use(Vuex)

const DEV = process.env.NODE_ENV === 'development'

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
  model(m) {
    const name = m && m.name
    // initial store instance
    if (!this.$store) {
      if (name) {
        // to initialize an empty store
        // will be used to register namespaced models
        this.$store = new Vuex.Store()
      } else {
        // to initialize a store with a top-level model
        // early return since we don't need to register namespaced model
        this.$store = new Vuex.Store(m)
        return
      }
    }
    if (DEV && !name) {
      throw new Error('[eva] Only one top-level model is allowed!')
    }
    // once the store intance is initialized
    // add namespaced model here
    this.$store.registerModule(name, m)
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
    this.$router = new VueRouter({
      routes: this.routes,
      mode: this.options.mode
    })
    this.vm = new Vue(assign({
      store: this.$store,
      router: this.$router
    }, app))
    this.vm.$mount(mountTo)
  }
}

EVA.mapState = Vuex.mapState
EVA.mapActions = Vuex.mapActions
EVA.mapMutations = Vuex.mapMutations
EVA.mapGetters = Vuex.mapGetters

export default EVA
