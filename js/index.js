let v = new Vue({
  el: '#app',
  data: {
    loading: true,
    mods: [],
    form: {
      search: '',
      minSearchLetters: 3
    },
    sentences: {
      searchAdvice: 'You can search by name or by version',
      lettersLeft: 'letters to start search...',
      loading: 'Loading mods...',
      failed: 'Failed to load mods. Check console for more informations',
      noresults: 'No results found for your search: '
    }
  },
  computed: {
    result: function() {
      return ''
    },
    emptyTable: function() {
      if(this.loading == true)
        return this.sentences.loading

      if(this.mods.length == 0)
        return this.sentences.failed
      
      if(this.filteredMods.length == 0)
        return this.sentences.noresults + this.form.search
      
      return ''
    },
    filteredMods: function() {
      if(this.form.search.length >= 2 && !isNaN(parseInt(this.form.search.charAt(0))))
        return this.mods.filter(mod => {
          let versions = mod.versions
          let found = false

          let i = 0
          while(i < versions.length && !found) {
            found = mos.versions[i].startsWith(this.form.search)

            ++i
          }

          return found
        })

      if(this.form.search.length >= this.form.minSearchLetters)
        return this.mods.filter(mod => mod.name[0].toLowerCase().includes(this.form.search.toLowerCase()))
      return this.mods;
    },
    searchAdvice: function() {
      if(this.loading == true || this.mods.length == 0)
        return ''

      if(this.form.search.length >= 2 && !isNaN(parseInt(this.form.search.charAt(0))) && this.filteredMods.length == 0)
        return 'Cannot find version ' + this.form.search

      if(this.form.search.length < this.form.minSearchLetters)
        return String((this.form.minSearchLetters - this.form.search.length) + ' ' + this.sentences.lettersLeft)
    }
  },
  methods: {
    download: function() {
      console.log('Hello World!')
    },
    modId: function(mod, version) {
      return String(mod.name[1] + '-' + version.replace(/\./g,''))
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
  }
})