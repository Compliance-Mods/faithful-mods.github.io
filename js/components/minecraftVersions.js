Vue.component('minecraft-versions', {
  props: {
    title: String,
    versions: Array,
    breakpoints: Object,
  },
  template:
    '<div id="minecraftVersions">\
      <h2>{{ title }}</h2>\
      <div v-for="(line, index) in versionsOrganized" :key="index" class="btn-group btn-block mt-0">\
        <download-minecraft-version v-for="version in line" :key="version.version" :value="version" />\
      </div>\
    </div>'
  ,
  data() {
    return {}
  },
  computed: {
    versionsOrganized: function() {
      const result = []

      for(let i =0; i < this.$props.versions.length; ++i) {
        if(i%this.elementsPerLine == 0) {
          result.push([])
        }

        result[result.length-1].push(this.$props.versions[i])
      }

      return result;
    },
    elementsPerLine: function() {
      if(!!this.$props.breakpoints.lg && !this.$props.breakpoints.md)
        return this.$props.versions.length

      if(!!this.$props.breakpoints.md && !this.$props.breakpoints.sm)
        return 5
      
      return 3
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