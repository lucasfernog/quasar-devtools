<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    this.$q.dark.set(localStorage.getItem('dark') === 'true')
    this.$q.bex.on('dark.content-change', event => {
      const dark = event.data
      this.$q.dark.set(dark)
    })
  }
}
</script>
