// import something here

// "async" is optional
export default async ({ Vue }) => {
  Vue.prototype.$qeval = (value, fn) => {
    return new Promise((resolve, reject) => {
      chrome.devtools.inspectedWindow.eval(`window.__QUASAR_DEVTOOLS__.Quasar.${value}`, (response, exception) => {
        if (exception) {
          reject(exception)
        } else {
          resolve(response)
        }
      })
    })
  }
}
