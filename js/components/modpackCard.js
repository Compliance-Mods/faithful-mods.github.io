/* global Vue */
/* eslint no-multi-str: 0 */

Vue.component('modpack-card', {
  props: ['modpack', 'cantDownload', 'onbuttonclick'],
  template:
    '<div class="card bg-dark">\
      <img class="card-img-top" :src="modpack.coverSource" alt="Card image" style="width:100%">\
      <div class="card-body">\
        <h4 class="card-title">{{ modpack.modpackName }}</h4>\
        <div class="card-text">\
          <div class="row">\
            <div class="col-8">\
              <small>\
                <p class="ma-0 text-left">Modpack version:</p>\
                <p class="text-left">Minecraft version:</p>\
              </small>\
            </div>\
            <div class="col">\
              <small>\
                <p class="ma-0 text-right">{{ modpack.modpackVersion }}</p>\
                <p align="right">{{ modpack.minecraftVersion }}</p>\
              </small>\
            </div>\
          </div>\
        </div>\
        <button v-on:click="onbuttonclick" :title="cantDownload" :disabled="cantDownload || !modpack.modList || modpack.modList.length == 0" class="btn btn-custom btn-block">Download</button>\
      </div>\
    </div>'
})
