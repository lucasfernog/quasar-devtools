<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="row items-center">
          <img alt="Quasar logo" src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" class="logo q-mr-sm">
          Detected Quasar {{ umd ? 'UMD' : 'CLI' }} {{ version }}
        </q-toolbar-title>

        <q-space />

        <q-select v-if="iconSetInstalled" label="Icon Set" :value="iconSet" @input="updateIconSet" :options="iconSets"
          dense options-dense color="white" input-class="text-white" filled
          use-input hide-selected fill-input input-debounce="100" @filter="filterIconSets" />
        <q-btn v-if="globalDarkEnabled" @click="toggleDark" flat round icon="invert_colors" />
      </q-toolbar>
      <q-tabs align="left">
        <q-route-tab label="API" to="api" exact />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

const iconSet = [
  'eva-icons',
  'fontawesome-v5-pro',
  'fontawesome-v5',
  'ionicons-v4',
  'material-icons-outlined',
  'material-icons-round',
  'material-icons-sharp',
  'material-icons',
  'mdi-v3',
  'mdi-v4',
  'themify'
]

export default {
  name: 'DevToolsLayout',

  data () {
    return {
      version: 'unknown',
      globalDarkEnabled: false,
      dark: false,
      iconSet: null,
      allIconSets: iconSet,
      iconSets: iconSet,
      umd: false,
      iconSetInstalled: true
    }
  },

  created () {
    this.$qeval('iconSet.name')
      .then(iconSet => {
        this.iconSet = iconSet
      })
    this.$qeval('version')
      .then(version => {
        this.version = version
      })
    this.$qeval('umd')
      .then(umd => {
        this.umd = !!umd
        if (this.umd) {
          this.$qeval('iconSet.__installed')
            .then(installed => {
              this.iconSetInstalled = installed
            })
        }
      })
    this.$qeval('dark.isActive')
      .then(dark => {
        this.dark = !!dark
        this.globalDarkEnabled = true
      })
      .catch(() => {
        this.globalDarkEnabled = false
      })
  },

  methods: {
    toggleDark () {
      this.dark = !this.dark
      this.$qeval(`dark.set(${this.dark ? 'true' : 'false'})`)
    },

    updateIconSet (iconSet) {
      this.iconSet = iconSet
      const set = require(`quasar/icon-set/${iconSet}.js`).default
      this.$qeval(this.umd ? `iconSet.set(${JSON.stringify(set)})` : `iconSet = ${JSON.stringify(set)}`)
    },

    filterIconSets (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.iconSets = this.allIconSets.filter(v => v.toLowerCase().includes(needle))
      })
    }
  }
}
</script>

<style lang="stylus">
.logo
  width 24px
  height 24px

.q-toolbar .q-select
  & .q-field__label, & .q-field__append
    color white
</style>
