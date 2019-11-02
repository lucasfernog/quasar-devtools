export default () => {
  // forked from https://github.com/vuejs/vue-devtools/blob/dev/packages/shell-chrome/src/devtools-background.js
  let created = false
  let checkCount = 0

  chrome.devtools.network.onNavigated.addListener(createPanelIfHasQuasar)
  const checkQuasarInterval = setInterval(createPanelIfHasQuasar, 1000)
  createPanelIfHasQuasar()

  function createPanelIfHasQuasar () {
    if (created || checkCount++ > 10) {
      clearInterval(checkQuasarInterval)
      return
    }

    chrome.devtools.inspectedWindow.eval(
      '!!(window.__QUASAR_DEVTOOLS__)',
      function (hasQuasar) {
        if (!hasQuasar || created) {
          return
        }
        clearInterval(checkQuasarInterval)
        created = true
        chrome.devtools.panels.create(
          'Quasar', 'icons/128.png', 'www/index.html#devtools-panel',
          panel => {
            // panel loaded
          }
        )
      }
    )
  }
}
