<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
window.QBexBridge && window.QBexBridge.on('testy', a => {
  console.log(a)
})
export default {
  name: 'App'
}
</script>
