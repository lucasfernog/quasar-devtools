// Content script content goes here or in activatedContentHooks (use activatedContentHooks if you need a variable
// accessible to both the content script and inside a hook

// forked from https://github.com/vuejs/vue-devtools/blob/dev/packages/shell-chrome/src/detector.js

function detectQuasar (win) {
  if (win.Quasar) { // UMD
    win.__QUASAR_DEVTOOLS__ = {
      Quasar: {
        version: win.Quasar.version,
        dark: win.Quasar.Dark,
        ...win.Quasar,
        umd: true
      }
    }
  } else { // CLI
    setTimeout(() => {
      const all = document.querySelectorAll('*')
      let el
      for (let i = 0; i < all.length; i++) {
        if (all[i].__vue__) {
          el = all[i]
          break
        }
      }

      if (el) {
        let Vue = Object.getPrototypeOf(el.__vue__).constructor
        while (Vue.super) {
          Vue = Vue.super
        }
        if (Vue.prototype.$q /* && Vue.config.devtools */) {
          win.__QUASAR_DEVTOOLS__ = { Quasar: Vue.prototype.$q }
        }
      }
    }, 100)
  }
}

if (document instanceof HTMLDocument) {
  // detectQuasar(window)
  installScript(detectQuasar)
}

function installScript (fn) {
  const source = ';(' + fn.toString() + ')(window)'

  const script = document.createElement('script')
  script.textContent = source
  document.documentElement.appendChild(script)
  script.parentNode.removeChild(script)
}
