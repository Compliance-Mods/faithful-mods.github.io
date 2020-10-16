/* global Vue, indexedDB */
/* eslint no-multi-str: 0 */

Vue.component('clear-database', {
  template:
  '<div class="form-group col-md-4">\
      <label for="clearDatabase" class="d-block pb-1">Database</label>\
      <button class="btn btn-block btn-custom" v-on:click="clearDB">Clear database</button>\
    </div>',
  methods: {
    clearDB: function () {
      const dbName = this.$root.$refs.localDownload.dbName

      // try to close db
      try {
        this.$root.$refs.localDownload.database.close()
      } catch (_err) {}

      const request = indexedDB.deleteDatabase(dbName)
      console.log('Clearing ' + dbName + ' database...')

      request.onsuccess = function (_event) {
        console.info(dbName + 'database cleared.')

        document.location.reload()
      }

      request.onerror = function (event) {
        console.error('Erreur lors de la suppression de la base', event)
      }

      request.onblocked = function (_event) {
        console.error("Couldn't delete database due to the operation being blocked")
      }
    }
  }
})
