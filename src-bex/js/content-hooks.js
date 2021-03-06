// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.

export default function attachActivatedContentHooks (bridge) {
  let quasarInstance = null
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

  bridge.on('font.weight-change', event => {
    const weightClass = event.data
    document.body.classList.forEach(name => {
      if (name.match(/w\d+i?/g)) {
        document.body.classList.remove(name)
      }
    })
    if (weightClass) {
      document.body.classList.add(event.data)
    }
  })

  bridge.on('dark.global-change', event => {
    const dark = event.data
    bridge.send('dark.content-change', dark)
  })

  bridge.on('quasar.detect', event => {
    quasarInstance = event.data
  })

  bridge.on('devtools.init', event => {
    quasarInstance && bridge.send(event.eventResponseKey, quasarInstance)
  })
}
