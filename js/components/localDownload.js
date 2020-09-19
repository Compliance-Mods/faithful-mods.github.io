Vue.component('local-download', {
  props: {
    canpack: Boolean,
  },
  template: 
    '<div>\
      <button id="DownloadLocally" :disabled="canDownloadLocally" class="btn btn-block btn-custom" v-on:click="openConfirmModal(undefined)">Download Resource Pack</button>\
      <div v-if="this.$root.modSelection.length != 0 && canDownloadLocally" class="advice text-center">Error: {{ reasonCantDownload }}</div>\
      \
      <div id="cacheClear" class="customModal" v-show="confirmOpened">\
        <div id="cacheClearContent" class="customModalContent p-3">\
          <h3>Some mods may already be downloaded. Do you want to use the last cached versions or re-download them?</h3>\
          <p class="mb-2">This might take longer to download but you will have the latest version of the resource packs.</p>\
          <div class="text-center row px-2">\
            <button type="button" class="btn btn-custom mx-1 mt-2 col-sm" v-on:click="downloadLocally(true)">NO</button>\
            <button type="button" class="btn btn-custom mx-1 mt-2 col-sm" v-on:click="downloadLocally(false)">YES</button>\
          </div>\
        </div><span class="taille">\
      </div>\
      \
      <div id="downloadModal" class="customModal" v-show="modalOpened">\
        <div id="downloadModalContent" class="customModalContent p-3">\
          <button type="button" :disabled="!canCloseModal" v-on:click="modalOpened = false" class="close" aria-label="Close">\
            <span aria-hidden="true">&times;</span>\
          </button>\
          <div id="steps" class="row pr-4">\
            <template v-for="(step, index) in steps" :key="step.name" >\
              <div class="col-auto text-center">\
                <button :disabled="index != currentStep" class="mx-auto px-0 btn btn-custom">{{ index+1 }}</button>\
              </div>\
              <div v-if="index < steps.length -1" class="line col"></div>\
            </template>\
          </div>\
          <h3 class="mt-3 mb-1">{{ "Step " + (currentStep+1) + ": " + steps[currentStep].name }}</h3>\
          <p class="mb-3">{{ "Estimated zipping time: " + finalZippingTime }}</p>\
          <p v-if="currentStep < 2">{{ steps[currentStep].content + currentMod.name + " v" + currentMod.version }}</p>\
          <p v-else>{{ steps[currentStep].content }}</p>\
          <div id="logs" ref="log">\
            <div v-for="(log, index) in logs" :key="index" :class="{ log: true, error: log.type === \'error\' }" :title="log.value">{{ log.value }}</div>\
          </div>\
        </div><span class="taille"></span>\
      </div>\
    </div>',
  data() {
    return {
      dbName: 'faithful',
      dbVersion: 3,
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
          content: 'Zipping... Please be patient...'
        }
      ],
      currentStep: 0,
      currentMod: '',
      modalOpened: false,
      confirmOpened: false,
      modSelection: undefined,
      logs: []
    }
  },
  methods: {
    openConfirmModal: function(modSelection) {
      this.modSelection = (!modSelection) ? this.$root.modSelection : modSelection

      this.confirmOpened = true
    },
    downloadMod: function(mod, forceDownlaod = false) {
      this.currentMod = mod
      this.logStep()

      if(forceDownlaod) {
        return axios({
          url:
            "https://api.allorigins.win/raw?url=https://github.com/" + "Faithful-Mods" + "/" + mod.name + "/archive/" + mod.version + ".zip",
          method: "GET",
          responseType: "blob" // important
        })
      }

      return new Promise((resolve, reject) => {
        const fileKey = this.fileKey(mod)
        this.store.get(fileKey).then(res => {
          this.log("Already downloaded " + mod.name + " v" + mod.version + " in cache")
          resolve({ data: res })
        }).catch(() => {
          axios({
            url:
              "https://api.allorigins.win/raw?url=https://github.com/" + "Faithful-Mods" + "/" + mod.name + "/archive/" + mod.version + ".zip",
            method: "GET",
            responseType: "blob" // important
          }).then(resolve).catch(reject)
        })
      })
    },
    downloadLocally: function(forceDownload = false) {
      // hide confirm modal
      this.confirmOpened = false

      this.logs = []

      const finalZip = new JSZip()

      this.isDownloading = true
      this.modalOpened = true
      
      this.currentStep = 0

      const promises = []
      this.modSelection.forEach(mod => {
        promises.push(this.downloadMod(mod, forceDownload))
      })

      let success = 0
      Promise.all(promises).then((values) => {
        this.currentStep = 1
        values.forEach((res, index) => {
          this.currentMod = this.modSelection[index]
          if(res.data.type == "text/xml") {
            console.warn(this.modSelection[index])
          }
          this.logStep()
          const fileKey = this.fileKey(this.modSelection[index])

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
            if(success == this.modSelection.length) {
              this.currentStep = 2
              this.logStep()
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
            console.log(res)
            this.error(err)
            this.isDownloading = false
          })
        })
      }).catch(reason => {
        this.error(reason)
        this.isDownloading = false
      })
    },
    addLog: function(value, isError = false) {
      this.logs.push({
        type: isError ? 'error' : 'log',
        value: '' + value
      })
    },
    fileKey: function(mod) {
      return mod.name + '-' + mod.version
    },
    logStep: function() {
      if(this.currentStep < this.steps.length - 1) {
        this.addLog(this.steps[this.currentStep].content + this.currentMod.name + " v" + this.currentMod.version)
      } else {
        this.addLog(this.steps[this.currentStep].content)
      }
    },
    log: function(obj) {
      this.addLog(obj)

      setTimeout(() => {
        let objDiv = this.$refs.log;
        objDiv.scrollTop = objDiv.scrollHeight + 100;
      }, 20)
    },
    error: function(err) {
      this.addLog(err, true)
      console.error(err)
    }
  },
  computed: {
    finalZippingTime: function() {
      let time = this.modSelection ? this.modSelection.length / 30 : undefined
      if(!time) return ''

      return Math.floor(time) + 'min ' + Math.round((time - Math.floor(time))*60*100)/100 + 's'
    },
    canDownloadLocally: function() {
      return !this.$props.canpack || this.isDownloading || !this.database || !this.store
    },
    reasonCantDownload: function() {
      if(!this.$props.canpack)
        return "This selection cannot be packed"
      
      if(this.isDownloading)
        return "You are currently downloading"

      if(!this.database)
        return "No database found"

      return "No database store found"
    },
    canCloseModal: function() {
      return this.modalOpened && !this.isDownloading
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
    .catch(err => {
      console.error(err)
    })
  }
})