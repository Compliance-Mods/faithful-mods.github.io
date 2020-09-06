Vue.component('minecraft-mod', {
  props: {
    mod: Object
  },
  template:
    '<li class="w3-bar">\
      <div v-if="!!imageSource" :style="{ \'background-image\': \'url(\' + imageSource + \')\' }" class="w3-bar-item w3-hide-small mod-img"></div>\
      <div class="w3-bar-item">\
        <input :id="mod.name[1]" type="checkbox" v-model="mod.selected">\
        <label class="w3-large" :for="mod.name[1]">{{ mod.name[0] }}</label>\
        <a v-if="!!link" :href="link" target="_blank" :title="link"><i class="fas fa-info-circle"></i></a>\
        <br>\
        <div :class="{ modNotChosen: !mod.selected }">\
          <template v-for="version in mod.versions":key="modId(mod, version)">\
            <input :disabled="!mod.selected" type="radio" :id="modId(mod, version)" :name="modId(mod, version)"  v-model="mod.versionSelected" :value="version">\
            <label :for="modId(mod, version)" class="mr-1">{{ version }}</label>\
          </template>\
        </div>\
      </div>\
    </li>',
  methods: {
    modId: function(mod, version) {
      return String(mod.name[1] + '-' + version.replace(/\./g,''))
    }
  },
  data: function() {
    return {
      imageSource: undefined,
      link: undefined
    }
  },
  mounted: function() {
    axios(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://addons-ecs.forgesvc.net/api/v2/addon/search?gameId=432&pageSize=1&sectionId=6&searchFilter=${this.$props.mod.name[0]}`)}`)
    .then(res => {
      // console.log(res.data)
      const results = res.data.filter(mod => {
        return mod.name.toLowerCase() === this.$props.mod.name[0].toLowerCase()
      })
      console.log(results)
      if(results.length > 0) {
        const attachments = results[0].attachments
        
        if(attachments.length > 0) {
          const index = Math.max(0, attachments.findIndex(att => att.isDefault))
          this.imageSource = attachments[index].url
        }

        this.link = results[0].websiteUrl
      }
    })
    .catch(err => {
      console.error(err)
    })
  }
})