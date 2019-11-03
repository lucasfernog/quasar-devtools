<template>
  <q-page padding>
    <!-- content -->
  </q-page>
</template>

<script>
export default {
  name: 'DevToolsPanel',

  created () {
    this.$q.bex.send('init')
    this.$q.bex.on('toggle', c => {
      console.log('on')
      this.$q.bex.send('toggled', true)
    })
  }
}
</script>
