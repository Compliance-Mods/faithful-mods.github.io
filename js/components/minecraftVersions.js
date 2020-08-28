Vue.component('minecraft-versions', {
  props: {
    versions: Array,
  },
  template:
    '<div id="minecraftVersions">\
      <download-minecraft-version v-for="version in versions" :key="version" :value="version" />\
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