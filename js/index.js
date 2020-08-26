let v = new Vue({
  el: '#app',
  data: {
    loading: true,
    mods: [],
    form: {
      search: '',
    },
    sentences: {
      loading: 'Loading mods...',
      failed: 'Failed to load mods. Check console for more informations',
      noresults: 'No results found for your search'
    }
  },
  computed: {
    result: function() {
      return ''
    },
    filteredMods: function() {
      if(this.form.search.length >= 3) {
        let name
        return this.mods.filter((mod) => mod.name[0].toLowerCase().includes(this.form.search.toLowerCase())
        })
      }
      return this.mods;
    },
    emptyTable: function() {
      if(loading == true)
        return this.sentences.loading

      if(this.mods.length == 0)
        return this.sentences.failed
      
      if(this.filteredMods.length == 0)
        return this.sentences.noresults
      
      return ''
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