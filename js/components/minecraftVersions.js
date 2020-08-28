Vue.component('minecraft-versions', {
  props: {
    title: String,
    versions: Array,
  },
  template:
    '<div id="minecraftVersions">\
      <h2>{{ title }}</h2>\
      <div class="btn-group btn-block">\
        <download-minecraft-version v-for="version in versions" :key="version" :value="version" />\
      </div>\
    </div>'
  ,
  data() {
    return {}
  },
  methods: {
    downloadVersion: function(version) {
      if(this.$root.handleDownload) {
        this.$root.handleDownload({
          version: version
        })
      }
    }
  }
});