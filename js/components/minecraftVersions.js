Vue.component('minecraft-versions', {
  props: {
    title: String,
    versions: Array,
  },
  template:
    '<div id="minecraftVersions">\
      <h2>{{ title }}</h2>\
      <div class="btn-group btn-block">\
        <download-minecraft-version v-for="version in orderedVersions" :key="version" :value="version" />\
      </div>\
    </div>'
  ,
  data() {
    return {}
  },
  computed: {
    orderedVersions: function() {
      return this.$props.versions.sort(function(a, b) {
        const numbers = MinecraftUtils.minecraftVersionsToNumbers([a, b])

        return (numbers[0] > numbers[1] ? -1 : 1)
      })
    }
  },
  methods: {
    downloadVersion: function(version) {
      if(this.$root.handleDownload) {
        this.$root.handleDownload('version', {
          version: version
        })
      }
    }
  }
});