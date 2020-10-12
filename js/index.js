/* global location, Vue, MinecraftUtils, getJSON */

Vue.config.devtools = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
const v = new Vue({ // eslint-disable-line no-unused-vars
  el: '#app',
  data: {
    form: {
      search: '',
      minSearchLetters: 3
    },
    isMounted: false,
    isLoadingDownload: false,
    loading: true,
    loadingVersions: true,
    mods: [],
    sentences: {
      searchAdvice: 'You can search by name or by version',
      lettersLeft: 'letters to start search...',
      loading: 'Loading mods...',
      failed: 'Failed to load mods. Check console for more informations',
      noresults: 'No results found for your search: ',
      noResultsVersion: 'No results found for version',
      typeAnotherVersion: 'Try to type another version than',
      downloadVersion: 'Download all resource packs for version :'
    },
    versions: {},
    breakpointLimits: {
      xs: 575,
      sm: 785,
      md: 1200,
      lg: Infinity
    },
    windowSize: window.innerWidth
  },
  computed: {
    breakpoints: function () {
      const result = {}

      const keys = Object.keys(this.breakpointLimits)

      for (let i = 0; i < keys.length; ++i) {
        result[keys[i]] = this.windowSize <= this.breakpointLimits[keys[i]]
      }

      return result
    },
    canPackMods: function () {
      return this.modPackageVersion !== undefined
    },
    emptyTable: function () {
      if (this.loading === true) return this.sentences.loading

      if (this.mods.length === 0) return this.sentences.failed

      if (this.form.search.length >= 1 && !isNaN(parseInt(this.form.search.charAt(0))) && this.filteredMods.length === 0) {
        return this.sentences.noResultsVersion + ' ' + this.form.search
      }

      if (this.filteredMods.length === 0) return this.sentences.noresults + this.form.search

      return ''
    },
    filteredMods: function () {
      if (this.form.search.length >= 1 && !isNaN(parseInt(this.form.search.charAt(0)))) {
        return this.mods.filter(mod => {
          let versions = mod.versions
          let found = false

          let i = 0
          while (i < versions.length && !found) {
            found = mod.versions[i].startsWith(this.form.search)

            ++i
          }

          return found
        })
      }

      if (this.form.search.length >= this.form.minSearchLetters) { return this.mods.filter(mod => mod.name[0].toLowerCase().includes(this.form.search.toLowerCase())) }
      return this.mods
    },
    exactVersionMode: function () {
      if (this.loadingVersions) { return false }

      return this.modSelection.findIndex(mod => {
        const correspondingNumbers = MinecraftUtils.minecraftVersionsToNumbers([this.versions['1'].min, mod.version])

        return correspondingNumbers[1] < correspondingNumbers[0]
      }) !== -1
    },
    modSelection: function () {
      let selection = this.mods.filter(mod => mod.selected && !!mod.versionSelected)

      return selection.map(mod => {
        return this.modToSelection(mod)
      })
    },
    downloadButtonText: function () {
      return this.isLoadingDownload ? '<i class="fas fa-spinner fa-spin"></i> Sending request...' : 'Download Resource Pack'
    },
    downloadReposModSelection: function () {
      let selection = this.mods.filter(mod => mod.selected && !!mod.versionSelected)

      return selection.map(mod => {
        return mod.repository + '/' + mod.name[1] + '#' + mod.versionSelected
      })
    },
    minecraftVersions: function () {
      const mcVersions = []

      for (let i = 0; i < this.mods.length; ++i) {
        for (let a = 0; a < this.mods[i].versions.length; ++a) {
          let index
          if ((index = mcVersions.findIndex(item => item.version === this.mods[i].versions[a])) === -1) {
            mcVersions.push({
              version: this.mods[i].versions[a],
              count: 1
            })
          } else {
            mcVersions[index].count = mcVersions[index].count + 1
          }
        }
      }

      return mcVersions
    },
    modPackageVersion: function () {
      // you can pack mods if they have the same package version number
      // (list of package number must not change)

      // we need mods and versions to be loaded
      if (this.loading || this.loadingVersions || this.modSelection.length === 0) { return undefined }

      let result
      let versionChanged = false
      let minecraftVersion

      let i = 0
      while (i < this.modSelection.length && !versionChanged) {
        if (this.exactVersionMode) {
          let tmp = this.modSelection[i].version

          if (minecraftVersion === undefined) {
            minecraftVersion = tmp
          } else {
            if (minecraftVersion !== tmp) { versionChanged = true }
          }
        } else {
          let tmp = this.packageVersion(this.modSelection[i].version)

          if (result === undefined) {
            result = tmp
          } else {
            if (result !== tmp) { versionChanged = true }
          }
        }

        ++i
      }

      return versionChanged ? undefined : (result || minecraftVersion)
    },
    searchAdvice: function () {
      if (this.loading === true || this.mods.length === 0) { return '' }

      if (this.form.search.length >= 1 && !isNaN(parseInt(this.form.search.charAt(0))) && this.filteredMods.length === 0) { return this.sentences.typeAnotherVersion + ' ' + this.form.search }

      if (this.form.search.length < this.form.minSearchLetters) { return String((this.form.minSearchLetters - this.form.search.length) + ' ' + this.sentences.lettersLeft) }
    }
  },
  methods: {
    modToSelection: function (mod, version = undefined) {
      return {
        name: mod.name[1],
        displayName: mod.name[0],
        repository: mod.repository,
        version: mod.versionSelected || version
      }
    },
    packageVersion: function (modVersion) {
      const numbers = MinecraftUtils.minecraftVersionToNumberArray(modVersion)

      const versionKeys = Object.keys(this.versions)

      let i = 0
      let result = -1
      while (i < versionKeys.length && result === -1) {
        const otherNumbersMin = MinecraftUtils.minecraftVersionToNumberArray(this.versions[versionKeys[i]].min)
        const otherNumbersMax = MinecraftUtils.minecraftVersionToNumberArray(this.versions[versionKeys[i]].max)

        // we compute the corresponding numbers
        let correspondingNumbers = MinecraftUtils.minecraftVersionsToNumbers([numbers, otherNumbersMin, otherNumbersMax])

        if (correspondingNumbers[0] >= correspondingNumbers[1] && correspondingNumbers[0] <= correspondingNumbers[2]) {
          result = versionKeys[i]
        }

        ++i
      }

      if (result === -1) {
        throw new Error('No versions file')
      }

      return result
    }
  },
  mounted: function () {
    this.isMounted = true

    getJSON('data/mods.json', (err, json) => {
      if (err) {
        console.error(err)
        return
      }
      this.loading = false
      this.mods = json
    })

    getJSON('data/versions.json', (err, json) => {
      if (err) {
        console.error(err)
        return
      }

      this.loadingVersions = false
      this.versions = json
    })

    // we need this part for breakpoints
    this.windowSize = window.innerWidth
    window.addEventListener('resize', () => { this.windowSize = window.innerWidth })
  }
})
