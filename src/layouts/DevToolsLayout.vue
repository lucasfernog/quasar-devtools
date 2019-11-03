<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="row items-center">
          <img alt="Quasar logo" src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" class="logo q-mr-sm">
          Detected Quasar {{ version }}
        </q-toolbar-title>

        <q-space />

        <q-btn v-if="globalDarkEnabled" @click="toggleDark" flat round icon="invert_colors" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'DevToolsLayout',

  data () {
    return {
      version: 'unknown',
      globalDarkEnabled: false,
      dark: false
    }
  },

  created () {
    chrome.devtools.inspectedWindow.eval('window.__QUASAR_DEVTOOLS__.Quasar.version', version => {
      this.version = version
    })
    chrome.devtools.inspectedWindow.eval('window.__QUASAR_DEVTOOLS__.Quasar.dark.isActive', (dark, exception) => {
      this.globalDarkEnabled = !exception
      this.dark = !!dark
    })
  },

  methods: {
    toggleDark () {
      this.dark = !this.dark
      chrome.devtools.inspectedWindow.eval(`window.__QUASAR_DEVTOOLS__.Quasar.dark.set(${this.dark ? 'true' : 'false'})`)
    }
  }
}
</script>

<style lang="stylus">
.logo
  width 24px
  height 24px
</style>
