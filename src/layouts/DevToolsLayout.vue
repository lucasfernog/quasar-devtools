<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Detected Quasar
        </q-toolbar-title>

        <q-space />

        <q-toggle :value="$q.dark.isActive" @input="toggleDark" label="Dark mode" />
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

  methods: {
    toggleDark () {
      this.$q.dark.set(!this.$q.dark.isActive)
      this.$q.notify(JSON.stringify(this.detectedQuasar))
      this.detectedQuasar.dark && this.detectedQuasar.dark.set(!this.detectedQuasar.dark.isActive)
    }
  }
}
</script>
