<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="row">
          <q-toggle :value="dark" @input="onDarkChange" label="Dark" />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'OptionsPage',
  data () {
    return {
      dark: localStorage.getItem('dark') === 'true'
    }
  },

  methods: {
    onDarkChange (dark) {
      this.dark = dark
      localStorage.setItem('dark', dark)
      this.$q.dark.set(dark)
      this.$q.bex.send('dark.options-change', dark)
    }
  }
}
</script>
