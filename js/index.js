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
    }
  },
  methods: {
    download: function() {
      console.log('Hello World!')
    }
  },
  mounted: function() {
    getJSON('data/mods.json', (err, json) => {
      this.mods = json
    })
  }
})