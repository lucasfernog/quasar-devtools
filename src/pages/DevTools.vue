<template>
<div></div>
</template>

<script>

export default {
  name: 'DevToolsPage',

  created () {
    window.QBexBridge.on('quasar.detect', event => {
      chrome.devtools.panels.create(
        'Quasar', 'icons/128.png', 'www/index.html#devtools/panel',
        panel => {
          // panel loaded
        }
      )
    })
  }
}
</script>
