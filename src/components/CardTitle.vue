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
$title-color: $grey-4
.doc-card-title
  padding: 2px 10px 2px 10px
  background: $title-color
  color: $grey-8
  position: relative
  border-radius: 3px 5px 5px 0
</style>
