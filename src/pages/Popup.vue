<template>
  <div class="column">
    <form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false">
      <q-input class="full-width algolia" ref="algolia"
          v-model="search" dense square dark borderless placeholder="Search...">
        <template #append>
          <q-icon name="search" @click="$refs.algolia.focus()" />
        </template>
      </q-input>
    </form>
    <q-list>
      <q-item clickable tag="a" href="https://quasar.dev/style/theme-builder" rel="noopener" target="_blank">
        <q-item-section class="text-teal" avatar>
          <q-icon name="style" />
        </q-item-section>
        <q-item-section>Theme Builder</q-item-section>
      </q-item>
      <q-item clickable tag="a" href="https://quasar.dev/layout-builder" rel="noopener" target="_blank">
        <q-item-section class="text-primary" avatar>
          <q-icon name="dashboard" />
        </q-item-section>
        <q-item-section>Layout Builder</q-item-section>
      </q-item>
      <q-item clickable tag="a" href="https://quasar.dev/layout/gallery" rel="noopener" target="_blank">
        <q-item-section class="text-grey-8" avatar>
          <q-icon name="shop_two" />
        </q-item-section>
        <q-item-section>Layout Gallery</q-item-section>
      </q-item>
      <q-item clickable tag="a" href="https://quasar.dev/layout/grid/flex-playground" rel="noopener" target="_blank">
        <q-item-section class="text-orange" avatar>
          <q-icon name="fas fa-flask" />
        </q-item-section>
        <q-item-section>Flex Playground</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  data () {
    return {
      search: ''
    }
  },
  mounted () {
    import('docsearch.js').then(docsearch => docsearch.default({
      apiKey: '5c15f3938ef24ae49e3a0e69dc4a140f',
      indexName: 'quasar-framework',
      inputSelector: '.algolia input',
      algoliaOptions: {
        hitsPerPage: 7
      },
      handleSelected: (a, b, suggestion, c, context) => {
        this.search = ''
        window.open(suggestion.url, '_blank')
        this.$refs.algolia.blur()
      }
    }))
  }
}
</script>

<style lang="stylus">
@import '../css/docsearch'

body
  width 270px

.algolia
  background $primary
  .q-field__control
    padding 0 18px 0 16px !important
  &.q-field--focused
    .q-icon
      color #fff
</style>
