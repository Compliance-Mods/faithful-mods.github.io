let v = new Vue({
  el: '#app',
  data: {
    form: {
      search: '',
      minSearchLetters: 3
    },
    loading: true,
    loadingVersions: true,
    mods: [],
    sentences: {
      searchAdvice: 'You can search by name or by version',
      lettersLeft: 'letters to start search...',
      loading: 'Loading mods...',
      failed: 'Failed to load mods. Check console for more informations',
      noresults: 'No results found for your search: ',
      noResultsVersion:  'Nor results found for version',
      typeAnotherVersion: 'Try to type another version than'
    },
    versions: {}
  },
  computed: {
    canPackMods: function() {
      return this.modPackageVersion != undefined
    },
    emptyTable: function() {
      if(this.loading == true)
        return this.sentences.loading

      if(this.mods.length == 0)
        return this.sentences.failed

      if(this.form.search.length >= 1 && !isNaN(parseInt(this.form.search.charAt(0))) && this.filteredMods.length == 0)
        return this.sentences.noResultsVersion + ' ' + this.form.search
      
      if(this.filteredMods.length == 0)
        return this.sentences.noresults + this.form.search
      
      return ''
    },
    filteredMods: function() {
      if(this.form.search.length >= 1 && !isNaN(parseInt(this.form.search.charAt(0))))
        return this.mods.filter(mod => {
          let versions = mod.versions
          let found = false

          let i = 0
          while(i < versions.length && !found) {
            found = mod.versions[i].startsWith(this.form.search)

            ++i
          }

          return found
        })

      if(this.form.search.length >= this.form.minSearchLetters)
        return this.mods.filter(mod => mod.name[0].toLowerCase().includes(this.form.search.toLowerCase()))
      return this.mods;
    },
    exactVersionMode: function() {
      if(this.loadingVersions)
        return false;

      const minNumberMinecraft = this.minecraftVersionsToNumbers([this.minecraftVersionToNumberArray(this.versions['1'])])
      return this.modSelection.findIndex(mod => this.minecraftVersionsToNumbers([this.minecraftVersionToNumberArray(this.mod.version)]) < minNumberMinecraft) != -1
    },
    modSelection: function() {
      let selection =  this.mods.filter(mod => mod.selected && !!mod.versionSelected)

      return selection.map(mod => {
        return {
          name: mod.name[1],
          version: mod.versionSelected
        }
      })
    },
    modPackageVersion: function() {
      // you can pack mods if they have the same package version number
      // (list of package number must not change)

      // we need mods and versions to be loaded
      if(this.loading || this.loadingVersions || this.modSelection.length == 0)
        return undefined

      let result = undefined
      let packageVersionChanged = false

      let i = 0
      while(i < this.modSelection.length && !packageVersionChanged) {
        let tmp = this.packageVersion(this.modSelection[i].version)

        if(result == undefined) {
          result = tmp
        } else {
          if(result != tmp)
            packageVersionChanged = true
        }

        ++i
      }

      return packageVersionChanged ? undefined : result
    },
    result: function() {
      return ''
    },
    searchAdvice: function() {
      if(this.loading == true || this.mods.length == 0)
        return ''

      if(this.form.search.length >= 1 && !isNaN(parseInt(this.form.search.charAt(0))) && this.filteredMods.length == 0)
        return this.sentences.typeAnotherVersion + ' ' + this.form.search

      if(this.form.search.length < this.form.minSearchLetters)
        return String((this.form.minSearchLetters - this.form.search.length) + ' ' + this.sentences.lettersLeft)
    }
  },
  methods: {
    download: function() {
      console.log('Hello World!')
    },
    minecraftVersionToNumberArray: function(version) {
      let numbers = version.split('.')
      if(numbers.length < 3) {
        for(let i = 0; i < 3-numbers.length; ++i) {
          numbers.push(0)
        }
      }

      return numbers.map(number => parseInt(number))
    },
    minecraftVersionsToNumbers: function(numbers) {
      // initial numbers : 1.10, 1.7.9, 1.11.2 ( 1.7.9 < 1.10 < 1.11.2 )
      //          result : 1100,  1079, 1112   (  1079 < 1100 < 1112 )
      let result = []

      // looking for max numbers count
      let maxNumbersCount = -1
      for(let i = 0; i < numbers.length; ++i) {
        if(numbers[i].length > maxNumbersCount)
          maxNumbersCount = numbers[i].length
        
        result.push('0') // we need this number to have a number to parse at the end
      }

      console.log(maxNumbersCount)

      for(let a = 0; a < maxNumbersCount; ++a) {
        // if it' the first number, we just add it to the end
        if(a == 0) {
          for(let i = 0; i < numbers.length; ++i) {
            result[i] += String(numbers[i][a])
          }
        } else {
          // else we need to add additional zeros equals to the difference of letters with max number
          // 0, 20, 600 -> 000, 020, 600

          // first we find the maxDigits for this number
          let maxDigits = -1
          for(let i = 0; i < numbers.length; ++i) {
            console.log(String(numbers[i][a] || ''), String(numbers[i][a] || '').length)
            if(String(numbers[i][a] || '').length > maxDigits) {
              maxDigits = String(numbers[i][a] || '').length
            }
          }

          console.log(maxDigits)

          // then for each nuber we add the difference of zeros
          for(let i = 0; i < numbers.length; ++i) {
            for(let b = 0; b < maxDigits - String(numbers[i][a] || '').length; ++b) {
              result[i] += '0'
            }

            // finally we push the number
            result[i] += String(numbers[i][a] || '')
          }
        }
      }

      return result.map(number => parseInt(number))
    },
    modId: function(mod, version) {
      return String(mod.name[1] + '-' + version.replace(/\./g,''))
    },
    packageVersion: function(modVersion) {
      const numbers = this.minecraftVersionToNumberArray(modVersion)

      const versionKeys = Object.keys(this.versions)

      let i = 0
      let result = -1
      while(i < versionKeys.length && result == -1) {
        otherNumbersMin = this.minecraftVersionToNumberArray(this.versions[versionKeys[i]].min)
        otherNumbersMax = this.minecraftVersionToNumberArray(this.versions[versionKeys[i]].max)

        // we compute the corresponding numbers
        let correspondingNumbers = this.minecraftVersionsToNumbers([numbers, otherNumbersMin, otherNumbersMax]);

        if(correspondingNumbers[0] >= correspondingNumbers[1] && correspondingNumbers[0] <= correspondingNumbers[2]) {
          result = versionKeys[i]
        }

        ++i
      }

      if(result == -1) {
        throw 'No versions file'
      }

      return result
    }
  },
  mounted: function() {
    getJSON('data/mods.json', (err, json) => {
      if(err) {
        console.error(err);
        return;
      }
      this.loading = false
      this.mods = json
    })

    getJSON('data/versions.json', (err, json) => {
      if(err) {
        console.error(err);
        return;
      }

      this.loadingVersions = false
      this.versions = json
    })
  }
})