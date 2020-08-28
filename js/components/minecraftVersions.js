Vue.component('minecraft-versions', {
  props: {
    title: String,
    versions: Array,
    breakpoints: Object,
  },
  template:
    '<div id="minecraftVersions">\
      <h2>{{ title }}</h2>\
      <div class="btn-group btn-block">\
        <template v-for="(version, index) in orderedVersions" :key="version">\
          <template v-if="index%elementsPerLine == 0"></div><div class="btn-group btn-block">\
          <download-minecraft-version :value="version" />\
        </template>\
      </div>\
    </div>'
  ,
  data() {
    return {}
  },
  computed: {
    elementsPerLine: function() {
      if(!!this.$props.breakpoints.sm)
        return 3

      if(!!this.$props.breakpoints.md)
        return 5

      return this.$props.versions.length
    },
    orderedVersions: function() {
      return this.$props.versions.sort(function(a, b) {
        const numbers = MinecraftUtils.minecraftVersionsToNumbers([a.version, b.version])

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