<template>
<div></div>
</template>

<script>

export default {
  name: 'DevToolsPanelLoad',
  created () {
    window.QBexBridge.send('devtools.init')
      .then(event => {
        this.$store.commit('updateDetectedQuasar', event.data)
        this.$router.replace('api')
      })
  }
}
</script>
