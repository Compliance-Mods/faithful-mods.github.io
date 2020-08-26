let v = new Vue({
  el: '#app',
  data: {
    emptyTable: 'Loading mods...',
    mods: [],
    form: {
      search: '',
    }
  },
  computed: {
    result: function() {
      return ''
    },
    filteredMods: function() {
      if(this.form.search.length >= 3) {
        return this.mods.map(mod => mod.includes(this.form.search))
      }
      return this.mods;
    }
  },
  methods: {
    download: function() {
      console.log('Hello World!')
    },
    modId: function(mod, version) {
      return String(mod.name[1] + '-' + version)
    }
  },
  mounted: function() {
    getJSON('data/mods.json', (err, json) => {
      if(err) {
        console.error(err);
        return;
      }
      this.mods = json
    })
  }
})