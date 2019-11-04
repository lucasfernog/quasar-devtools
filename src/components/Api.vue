<template>
  <q-card class="doc-api q-my-lg" v-if="ready" flat="flat" bordered="bordered">
    <q-separator />
      <div class="bg-grey-2 text-grey-7 flex no-wrap">
        <q-tabs class="col" v-model="currentTab" indicator-color="primary" align="left" :breakpoint="0" dense="dense">
          <q-tab v-for="tab in tabs" :key="`api-tab-${tab}`" :name="tab">
            <div class="row no-wrap items-center"><span class="q-mr-xs text-uppercase text-weight-medium">{{ tab }}</span>
              <q-badge v-if="tabCount[tab]">{{ tabCount[tab] }}</q-badge>
            </div>
          </q-tab>
        </q-tabs>
        <q-input class="q-mx-sm" v-if="$q.screen.gt.xs" ref="input" v-model="filter" dense="dense" input-class="text-right" borderless placeholder="Filter..." style="min-width: 150px;">
          <template v-slot:append>
            <q-icon class="cursor-pointer" :name="filter !== '' ? 'clear' : 'search'" @click="onFilterClick" />
          </template>
        </q-input>
      </div>
    <q-separator></q-separator>
    <q-tab-panels v-model="currentTab" animated>
      <q-tab-panel class="q-pa-none" v-for="tab in tabs" :name="tab" :key="tab">
        <div class="row no-wrap api-container" v-if="aggregationModel[tab]">
          <div class="col-auto row no-wrap bg-grey-1 text-grey-7 q-py-lg">
            <q-tabs v-model="currentInnerTab[tab]" active-color="primary" indicator-color="primary" :breakpoint="0" vertical dense shrink>
              <q-tab class="inner-tab" v-for="category in apiTabs(tab)" :key="`api-inner-tab-${category}`" :name="category">
                <div class="row no-wrap items-center self-stretch">
                  <span class="q-mr-xs text-capitalize text-weight-medium">{{ category }}</span>
                  <div class="col"></div>
                  <q-badge v-if="apiInnerCount(tab, category)">{{ formattedApiInnerCount(tab, category) }}</q-badge>
                </div>
              </q-tab>
            </q-tabs>
         </div>
          <q-separator vertical></q-separator>
          <q-tab-panels class="col" v-model="currentInnerTab[tab]" animated transition-prev="slide-down" transition-next="slide-up">
            <q-tab-panel class="q-pa-none" v-for="category in apiTabs(tab)" :name="category" :key="category">
               <ApiRows :which="tab" :apiKey="category" :api="filteredApi[tab]" />
            </q-tab-panel>
          </q-tab-panels>
        </div>
        <div class="api-container" v-else>
          <ApiRows :which="tab" :api="filteredApi" />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script>
import ApiRows from './ApiRows.js'
import { format } from 'quasar'
const { pad } = format
const groupBy = (list, groupKey, defaultGroupKeyValue) => {
  const res = {}
  for (let key in list) {
    if (list.hasOwnProperty(key)) {
      let value = list[key]
      let groupKeyValue = (value[groupKey] || defaultGroupKeyValue).split('|')
      for (let groupKeyV of groupKeyValue) {
        if (res[groupKeyV] === void 0) {
          res[groupKeyV] = {}
        }
        res[groupKeyV][key] = value
      }
    }
  }
  return res
}
export default {
  name: 'Api',

  components: {
    ApiRows
  },

  props: {
    file: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      ready: false,
      currentTab: null,
      currentInnerTab: {
        props: null
      },
      filter: '',
      filteredApi: {},
      tabCount: {}
    }
  },

  watch: {
    file: {
      immediate: true,
      handler (val) {
        if (val) {
          import(
            `quasar/dist/api/${val}.json`
          ).then(json => {
            this.parseJson(val, json.default)
            this.ready = true
          })
        } else {
          this.ready = false
        }
      }
    },
    filter (val) {
      val = val.trim().toLowerCase()
      if (val === '') {
        this.filteredApi = this.api
        this.tabs.forEach(tab => {
          this.tabCount[tab] = this.apiCount(tab)
        })
        return
      }
      const api = {}
      this.tabs.forEach(tab => {
        if (tab === 'injection') {
          api[tab] = this.api[tab]
          return
        }
        const filterApi = tabApi => {
          const filtered = {}
          Object.keys(tabApi).forEach(name => {
            if (
              (name.toLowerCase().indexOf(val) > -1) ||
              (tabApi[name].desc !== void 0 && tabApi[name].desc.toLowerCase().indexOf(val) > -1)
            ) {
              filtered[name] = tabApi[name]
            }
          })
          return filtered
        }
        if (this.aggregationModel[tab]) {
          api[tab] = {}
          for (let group in this.api[tab]) {
            if (this.api[tab].hasOwnProperty(group)) {
              api[tab][group] = filterApi(this.api[tab][group])
            }
          }
          if (this.currentTab === tab) {
            let apiWithResultsCount = 0,
              lastFoundApiWithResults = null
            for (let group in this.api[tab]) {
              if (Object.keys(api[tab][group]).length > 0) {
                apiWithResultsCount++
                lastFoundApiWithResults = group
              }
            }
            if (apiWithResultsCount === 1) {
              this.currentInnerTab[tab] = lastFoundApiWithResults
            }
          }
        } else {
          api[tab] = filterApi(this.api[tab])
        }
      })
      this.filteredApi = api
      this.tabs.forEach(tab => {
        this.tabCount[tab] = this.apiCount(tab)
      })
    }
  },

  methods: {
    parseJson (name, { type, behavior, ...api }) {
      this.aggregationModel = {}
      if (type === 'component' && api.props !== void 0) {
        for (let apiGroup of ['props']) {
          api[apiGroup] = groupBy(api[apiGroup], 'category', 'general')
          this.currentInnerTab[apiGroup] = this.apiTabs(apiGroup, api)[0]
          this.aggregationModel[apiGroup] = true
        }
      }
      this.api = api
      this.filteredApi = api
      this.apiType = type
      this.name = name
      this.type = `${type === 'plugin' ? 'Quasar' : 'Vue'} ${type.charAt(0).toUpperCase()}${type.substring(1)}`
      this.tabs = Object.keys(api)
      if (
        behavior !== void 0 &&
        behavior.$listeners !== void 0
      ) {
        !this.tabs.includes('events') && this.tabs.push('events')
        this.api.events = {
          $listeners: behavior.$listeners,
          ...(this.api.events || {})
        }
      }
      this.currentTab = this.tabs[0]
      this.tabs.forEach(tab => {
        this.tabCount[tab] = this.apiCount(tab)
      })
    },
    onFilterClick () {
      if (this.filter !== '') {
        this.filter = ''
      }
      this.$refs.input.focus()
    },
    apiTabs (tab, api) {
      return Object.keys((api || this.filteredApi)[tab]).sort()
    },
    apiCount (tab) {
      if (this.apiType !== 'plugin' && tab === 'props') {
        let total = 0
        if (this.currentTabMaxCategoryPropCount > 0) {
          Object.keys(this.filteredApi[tab]).forEach(key => {
            total += Object.keys(this.filteredApi[tab][key]).length
          })
        }
        return total
      }
      if (['value', 'arg', 'quasarConfOptions', 'injection'].includes(tab)) {
        return 1
      }
      return Object.keys(this.filteredApi[tab]).length
    },
    apiInnerCount (tab, category) {
      return Object.keys(this.filteredApi[tab][category]).length
    },
    formattedApiInnerCount (tab, category) {
      return pad(this.apiInnerCount(tab, category), (this.currentTabMaxCategoryPropCount + '').length)
    }
  },

  computed: {
    currentTabMaxCategoryPropCount () {
      if (this.aggregationModel[this.currentTab]) {
        let max = -1
        for (let category in this.filteredApi[this.currentTab]) {
          let count = this.apiInnerCount(this.currentTab, category)
          if (count > max) {
            max = count
          }
        }
        return max
      }
      return 0
    }
  }
}
</script>

<style lang="stylus">
.doc-api
  .q-tab
    height 40px
  .inner-tab
    justify-content left
    .q-tab__content
      width 100%
  .api-container
    max-height calc(100vh - 220px)
</style>
