Vue.component('local-download', {
  props: {
    canPack: Boolean,
  },
  template: 
    '<div>\
      <button id="DownloadLocally" :disabled="canDownloadLocally" class="btn btn-block btn-custom" v-on:click="downloadLocally">Download locally (ALPHA)</button>\
      <div id="downloadModal" v-show="isDownloading">\
        <div id="downloadModalContent">\
          <h1>{{ steps[currentStep].name }}</h1>\
          <p v-if="currentStep < 2">{{ steps[currentStep].content + currentMod.name + " v" + currentMod.version }}</p>\
          <p v-else>{{ steps[currentStep].content }}</p>\
        </div>\
      </div>\
    </div>',
  data() {
    return {
      dbName: 'faithful',
      dbVersion: 2.0,
      database: null,
      isDownloading: false,
      store: null,
      stores: [
        {
          name: 'files',
          options: { autoIncrement: true }
        }
      ],
      steps: [
        {
          name: 'Downloading mods',
          content: 'Downloading '
        },
        {
          name: 'Unzipping mods',
          content: 'Extracting '
        },
        {
          name: 'Creating archive',
          content: 'Zipping...'
        }
      ],
      currentStep: 0,
      currentMod: ''
    }
  },
  methods: {
    downloadMod: function(mod) {
      this.currentMod = mod
      return axios({
        url:
          "https://api.allorigins.win/raw?url=https://github.com/" + "Faithful-Mods" + "/" + mod.name + "/archive/" + mod.version + ".zip",
        method: "GET",
        responseType: "blob" // important
      })
    },
    downloadLocally: function() {
      const finalZip = new JSZip()

      this.isDownloading = true

      const modSelection = this.$root.modSelection

      const promises = []
      modSelection.forEach(mod => {
        promises.push(this.downloadMod(mod))
      })
      
      this.currentStep = 0

      let success = 0
      Promise.all(promises).then((values) => {
        this.currentStep = 1
        values.forEach((res, index) => {
          this.currentMod = modSelection[index]
          const fileKey = modSelection[index].name + '-' + modSelection[index].version

          this.store.delete(fileKey).then(() => {
            return this.store.put(res.data, fileKey)
          })
          .then(() => {
            let zip = new JSZip()
            return zip.loadAsync(res.data)
          })
          .then((zip) => {
            const keys = Object.keys(zip.files)
          
            let newName
            for(let i = 0; i < keys.length; ++i) {
              newName = keys[i].replace(fileKey + '/', '')
              
              if(newName.trim() !== '') {
                finalZip.files[newName] = zip.files[keys[i]]
                finalZip.files[newName].name = newName
              }
            }

            ++success
            // if all archives have been successfully added
            if(success == modSelection.length) {
              this.currentStep = 2
              finalZip.generateAsync({
                type:"blob",
                comment: "Resource pack generated by Faithful Mods",
                compression: "DEFLATE",
                compressionOptions: {
                  level: 9
                }
              }).then(blob => {            // 1) generate the zip file
                  saveAs(blob, 'Faithful Mods Resource Pack ' + ((new Date).getTime()) + ".zip") // 2) trigger the download
                  this.isDownloading = false
              }, err => {
                  console.error(err)
                  this.isDownloading = false
              });
            }
          }).catch(err => {
            console.error(err)
            this.isDownloading = false
          })
        })
      }).catch(reason => {
        console.error(reason)
        this.isDownloading = false
      })
    }
  },
  computed: {
    canDownloadLocally: function() {
      return !this.$props.canPack || this.isDownloading
    }
  },
  mounted: function() {  
    IndexedDBPromise.open(this.dbName, this.dbVersion, this.stores)
    .then((db) => {
      this.database = db
      return db.getStore(this.stores[0].name, 'readwrite', true)
    })
    .then((store) => {
      this.store = store
    })
  }
})