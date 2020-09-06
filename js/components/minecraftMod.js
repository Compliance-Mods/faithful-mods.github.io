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
        <a v-if="!!link" :href="link" target="_blank" :title="link" class="ml-2"><i class="fas fa-info-circle"></i></a>\
        <br>\
        <div :class="{ \'mt-1\': true, modNotChosen: !mod.selected }">\
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
    },
    search(index, searchFilter, fullName = false) {
      return new Promise((resolve, reject) => {
        const size = index * 25
        const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://addons-ecs.forgesvc.net/api/v2/addon/search?gameId=432&pageSize=${size}&sectionId=6&searchFilter=${ searchFilter }`)}`

        axios(url)
          .then(res => {
            const result = res.data.find(mod => {
              let found = false
              if(this.$props.mod.name[2]) {
                found = mod.websiteUrl.split('/').pop() === this.$props.mod.name[2]
              }
              
              return found || mod.name.toLowerCase() === this.$props.mod.name[0].toLowerCase()
            })

            if(result) {
              resolve(result)
            } else {
              reject(result)
            }
          })
          .catch(err => {
            reject(-1)
          })
      })
    },
    makeSearch: function(index = 1, fullName = false) {
      return new Promise((resolve, reject) => {
        let searchFilter = fullName ? this.$props.mod.name[0] : this.$props.mod.name[2]
        this.search(index, searchFilter)
        .then(results => {
          resolve(results)
        }).catch(err => {
          if(isNaN(err)) {
            if(index < this.searchPages) {
              this.makeSearch(index + 1, fullName).then(res => {
                resolve(res)
              }).catch(err => {
                reject(err)
              })
            } else {
              if(!fullName) {
                this.makeSearch(1, true).then(res => {
                  resolve(res)
                }).catch(err => {
                  reject(err)
                })
              } else {
                reject()
              }
            }
          } else {
            reject()
          }
        })
      })
    }
  },
  data: function() {
    return {
      searchPages: 3,
      imageSource: undefined,
      link: undefined
    }
  },
  mounted: function() {
    this.makeSearch().then(result => {
      const attachments = result.attachments
        
      if(attachments.length > 0) {
        const index = Math.max(0, attachments.findIndex(att => att.isDefault))
        this.imageSource = attachments[index].thumbnailUrl
      }

      this.link = result.websiteUrl
    }).catch(err => {
      console.error(err)
      console.error(this.$props.mod.name[2] || this.$props.mod.name[0])
    })
  }
})