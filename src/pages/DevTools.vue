<template>
<div></div>
</template>

<script>

function waitBridge (cb) {
  if (!window.QBexBridge) {
    setTimeout(waitBridge, 50)
  } else {
    cb()
  }
}

export default {
  name: 'DevToolsPage',

  created () {
    waitBridge(() => {
      window.QBexBridge.send('devtools.init')
        .then(() => {
          chrome.devtools.panels.create(
            'Quasar', 'icons/128.png', 'www/index.html#devtools/panel',
            panel => {
              // panel loaded
            }
          )
        })
    })
  }
}
</script>
