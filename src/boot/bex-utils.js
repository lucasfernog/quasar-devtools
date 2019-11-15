// import something here

// "async" is optional
export default async ({ Vue }) => {
  Vue.mixin({
    computed: {
      $qq () {
        return this.$store.state.$q
      }
    }
  })
  Vue.prototype.$qeval = value => {
    return new Promise((resolve, reject) => {
      const quasarPath = 'window.__QUASAR_DEVTOOLS__.Quasar'
      const evalString = value.includes('$quasar') ? value.replace(quasarPath) : `${quasarPath}.${value}`
      chrome.devtools.inspectedWindow.eval(evalString, (response, exception) => {
        if (exception) {
          reject(exception)
        } else {
          resolve(response)
        }
      })
    })
  }
}
