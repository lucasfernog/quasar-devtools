<template>
  <q-page padding class="column items-center">
    <q-select class="file-selector" label="Component, plugin or directive" :value="selectedFile" @input="updateFile" :options="filteredFiles"
      dense options-dense filled
      use-input hide-selected fill-input input-debounce="100" @filter="filterFiles" />
    <div class="full-width q-mt-lg">
      <api :class="{ hidden: !selectedFile }" ref="api" :version="version" />
      <div v-if="error">{{ error }}</div>
    </div>
  </q-page>
</template>

<script>

import Api from '../components/Api.vue'

export default {
  name: 'DevToolsApiPage',

  components: {
    Api
  },

  data () {
    return {
      files: [],
      filteredFiles: [],
      selectedFile: null,
      version: null,
      error: null
    }
  },

  created () {
    this.$qeval('version')
      .then(version => {
        this.version = version
        fetch(`https://data.jsdelivr.com/v1/package/npm/quasar@${version}`)
          .then(response => response.json())
          .then(response => {
            const dirLookup = (dirStructure, desiredDir) => {
              for (const file of dirStructure.files) {
                if (file.type === 'directory' && file.name === desiredDir) {
                  return file
                }
              }
              throw new Error(`Dir ${desiredDir} not found`)
            }
            const dist = dirLookup(response, 'dist')
            const api = dirLookup(dist, 'api')
            for (const file of api.files) {
              if (file.name.endsWith('.json')) {
                this.files.push(file.name.replace('.json', ''))
              }
            }
          })
      })
  },

  methods: {
    filterFiles (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.filteredFiles = this.files.filter(v => v.toLowerCase().includes(needle))
      })
    },

    updateFile (file) {
      this.selectedFile = file
      this.error = null
      fetch(`https://cdn.jsdelivr.net/npm/quasar@${this.version}/dist/api/${file}.json`)
        .then(response => response.json())
        .then(json => {
          this.$refs.api.parseJson(file, json)
        })
        .catch(() => {
          this.error = `Failed to load ${file} API definition for Quasar version ${this.version}`
        })
    }
  }
}
</script>

<style lang="stylus">
.file-selector
  position absolute
  top 16px
</style>
