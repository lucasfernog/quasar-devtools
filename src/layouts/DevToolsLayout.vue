<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="row items-center">
          <img alt="Quasar logo" src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" class="logo q-mr-sm">
          Detected Quasar {{ $qq.umd ? 'UMD' : 'CLI' }} {{ $qq.version }}
        </q-toolbar-title>
        <q-space />
        <q-tabs shrink stretch>
          <q-route-tab label="API" to="api" exact />
          <q-route-tab label="Global" to="global" exact />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'DevToolsLayout'
}
</script>

<style lang="stylus">
.logo
  width 24px
  height 24px
</style>
