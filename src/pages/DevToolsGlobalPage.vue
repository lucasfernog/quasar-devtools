<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col">
        <q-select v-if="iconSetInstalled" label="Icon Set" :value="iconSet" @input="updateIconSet" :options="iconSets"
          dense options-dense filled
          use-input hide-selected fill-input input-debounce="100" @filter="filterIconSets" />
      </div>
      <div class="col">
        <q-select v-if="langInstalled" label="Language" :value="lang" @input="updateLang" :options="langs"
          dense options-dense filled
          use-input hide-selected fill-input input-debounce="100" @filter="filterLangs" />
      </div>
      <div class="col">
        <q-select label="Font" :value="font" @input="updateFont" :options="fonts"
          dense options-dense filled bottom-slots
          use-input hide-selected fill-input input-debounce="100" @filter="filterFonts">
          <template #append>
            <q-btn size="sm" color="accent" v-if="weights.length" :label="weight">
              <q-menu>
                <q-list>
                  <q-item clickable v-for="w in weights" :key="w">
                    <q-item-section @click="updateWeight(w)">{{ w }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </template>
          <template #hint>
            <div v-if="font" class="column">
              <span>{{ fontLink }}</span>
              <span>Classes: "{{ font.replace(' ', '-') + (weight ? ' ' + weight : '')}}"</span>
            </div>
          </template>
        </q-select>
      </div>
    </div>
    <div class="column q-mt-md q-col-gutter-xs">
      <div class="col">
        <q-btn v-if="globalDarkEnabled" @click="toggleDark" flat icon="invert_colors" label="Invert colors" />
      </div>
      <div class="col">
        <q-toggle :value="rtl" @input="toggleRtl" label="RTL" />
      </div>
    </div>
  </q-page>
</template>

<script>
import iconSet from '../assets/iconSet'
import langs from '../assets/lang'
import { fonts, fontsMapping } from '../assets/fonts'

export default {
  name: 'DevToolsGlobalPage',

  data () {
    return {
      globalDarkEnabled: false,
      dark: false,
      iconSet: null,
      iconSets: iconSet,
      iconSetInstalled: true,
      lang: null,
      langs: langs,
      langInstalled: true,
      rtl: false,
      font: null,
      fonts,
      weight: null,
      weights: []
    }
  },

  computed: {
    fontUrl () {
      return this.font
        ? `https://pagecdn.io/lib/easyfonts/${this.font.replace(/ /g, '-').toLowerCase()}.css`
        : ''
    },
    fontLink () {
      return `<link href="${this.fontUrl}" rel="stylesheet" />`
    }
  },

  created () {
    this.$qeval('iconSet.name')
      .then(iconSet => {
        this.iconSet = iconSet
      })

    this.$qeval('lang.rtl')
      .then(rtl => {
        this.rtl = rtl
      })

    this.$qeval('umd')
      .then(umd => {
        if (umd) {
          this.$qeval('Object.keys($quasar.lang)')
            .then(installedLangs => {
              this.langs = langs = installedLangs
            })
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
        this.iconSets = iconSet.filter(v => v.toLowerCase().includes(needle))
      })
    },

    updateLang (lang) {
      this.lang = lang
      const set = require(`quasar/lang/${lang}.js`).default
      this.$qeval(`lang.set(${JSON.stringify(set)})`)
    },

    filterLangs (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.langs = langs.filter(v => v.toLowerCase().includes(needle))
      })
    },

    toggleRtl (rtl) {
      this.rtl = rtl
      this.$qeval(`lang.rtl = ${rtl}`)
    },

    updateFont (font) {
      this.font = font
      this.weights = fontsMapping[font].weights
      this.updateWeight(this.weights.length ? this.weights[0] : null)
      this.$q.bex.send('font.load-request', {
        url: this.fontUrl,
        className: fontsMapping[font].className
      })
    },

    filterFonts (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.fonts = fonts.filter(v => v.toLowerCase().includes(needle))
      })
    },

    updateWeight (weight) {
      this.weight = weight
      this.$q.bex.send('font.weight-change', weight)
    }
  }
}
</script>
