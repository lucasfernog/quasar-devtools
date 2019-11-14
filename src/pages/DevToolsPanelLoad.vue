<template>
<div></div>
</template>

<script>

export default {
  name: 'DevToolsPanelLoad',
  created () {
    window.QBexBridge.on('devtools.instance', event => {
      this.$store.commit('updateDetectedQuasar', event.data)
      this.$router.replace('api')
    })
    window.QBexBridge.send('devtools.init')
  }
}
</script>
