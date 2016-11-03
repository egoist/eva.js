import Vue from 'RESOLVE_VUE' // eslint-disable-line import/no-extraneous-dependencies
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import assign from 'object-assign'
import {sync} from 'vuex-router-sync'

const {
  Store,
  mapActions,
  mapGetters,
  mapMutations,
  mapState
} = Vuex

Vue.use(VueRouter)
Vue.use(Vuex)

const DEV = process.env.NODE_ENV === 'development'

class EVA {
  constructor(options = {}) {
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
        this.$store = new Store()
      } else {
        // to initialize a store with a top-level model
        // early return since we don't need to register namespaced model
        this.$store = new Store(m)
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
    // pass route object directly
    if (typeof path === 'object') {
      return path
    }
    // pass (path, component, children) to make a route object
    return {
      path,
      component,
      children
    }
  }
  router(handleRoute) {
    const defaultOptions = {
      mode: this.options.mode
    }
    if (typeof handleRoute === 'function') {
      // use route helper to form options
      this.$router = new VueRouter(assign(defaultOptions, {
        routes: handleRoute(this.route)
      }))
    } else {
      // use given options directly
      this.$router = new VueRouter(assign(defaultOptions, handleRoute))
    }
  }
  start(app, mountTo) {
    if (this.$store && this.$router) {
      sync(this.$store, this.$router)
    }
    this.vm = new Vue(assign({
      store: this.$store,
      router: this.$router
    }, app))
    this.vm.$mount(mountTo)
  }
}

export default EVA

export {
  mapActions,
  mapGetters,
  mapMutations,
  mapState,
  Vue
}
