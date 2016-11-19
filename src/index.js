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

const defaultApp = {
  render(h) {
    return h('div', {
      attrs: {id: 'app'}
    }, [
      h('router-view')
    ])
  }
}

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
  createInstance(app) {
    return new Vue(assign({
      store: this.$store,
      router: this.$router
    }, app))
  }
  start(app = defaultApp, selector) {
    // you can omit app
    // and only specific selector
    // or omit both
    // then we will use defaultApp for app
    if (typeof app === 'string') {
      selector = app
      app = defaultApp
    }
    this.syncRouterInStore()
    this.instance = this.createInstance(app)
    if (selector) {
      this.mount(selector)
    }
    return this
  }
  mount(selector = '#app') {
    if (!this.mounted) {
      this.mounted = true
      this.instance.$mount(selector)
    }
  }
  syncRouterInStore() {
    if (!this.sync && this.$store && this.$router) {
      this.sync = true
      sync(this.$store, this.$router)
    }
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
