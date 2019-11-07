// Hooks added here have a bridge allowing communication between the BEX Background Script and the BEX Content Script.

export default function attachActivatedBackgroundHooks (bridge) {
  bridge.on('dark.options-change', event => {
    const dark = event.data
    bridge.send('dark.global-change', dark)
  })
}
