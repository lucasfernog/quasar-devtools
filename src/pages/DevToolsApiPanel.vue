<template>
  <q-page padding class="column items-center">
    <q-select class="component-selector" label="Component" v-model="selectedComponent" :options="filteredComponents"
      dense options-dense filled
      use-input hide-selected fill-input input-debounce="100" @filter="filterComponents" />
    <div class="full-width q-mt-lg">
      <api :file="selectedComponent" />
    </div>
  </q-page>
</template>

<script>

import Api from '../components/Api.vue'

const components = require.context('../../node_modules/quasar/dist/api', true, /^\.\/.*\.json$/)
  .keys()
  .map(key => key.replace('./', '').replace('.json', ''))
  .filter(name => name[0] === 'Q')

export default {
  name: 'DevToolsApiPanel',

  components: {
    Api
  },

  data () {
    return {
      components: components,
      filteredComponents: components,
      selectedComponent: null
    }
  },

  methods: {
    filterComponents (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.filteredComponents = this.components.filter(v => v.toLowerCase().includes(needle))
      })
    }
  }
}
</script>

<style lang="stylus">
.component-selector
  position absolute
  top 16px
</style>
