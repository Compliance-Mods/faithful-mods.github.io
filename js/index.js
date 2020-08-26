let v = new Vue({
  el: '#app',
  data: {
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
      console.log('Hello World!');
    }
  }
})