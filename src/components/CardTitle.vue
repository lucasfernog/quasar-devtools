<template>
  <section class="q-my-sm q-mr-md cursor-pointer text-subtitle1">
    <div class="doc-card-title">{{ title }} API</div>
  </section>
</template>

<script>
export default {
  name: 'CardTitle',
  props: {
    title: String
  }
}
</script>

<style lang="sass">
.doc-card-title
  padding: 2px 10px 2px 10px
  position: relative
  border-radius: 3px 5px 5px 0

.body--dark .doc-card-title
  background: $grey-7
  color: $grey-3

.body--light .doc-card-title
  background: $grey-4
  color: $grey-8
</style>
