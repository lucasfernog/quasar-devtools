// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.

export default function attachActivatedContentHooks (window, chrome, bridge) {
  // Hook into the bridge to listen for events sent from the client BEX.
  bridge.on('font.load-request', event => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = event.data.url
    document.head.appendChild(link)
    document.body.classList.forEach(name => {
      if (name.startsWith('font-')) {
        document.body.classList.remove(name)
      }
    })
    document.body.classList.add(event.data.className)
  })
}
