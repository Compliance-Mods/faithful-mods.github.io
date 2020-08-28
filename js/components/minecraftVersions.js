Vue.component('minecraft-versions', {
  props: {
    title: String,
    versions: Array,
    breakpoints: Object,
  },
  template:
    '<div id="minecraftVersions">\
      <h2>{{ title }}</h2>\
      <div v-for="(line, index) in versionsOrganized" :key="index" class="btn-group btn-block">\
        <download-minecraft-version v-for="version in line" :key="version" :value="version" />\
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
    numberOfLines: function() {
      return this.versionsOrganized.length;
    },
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