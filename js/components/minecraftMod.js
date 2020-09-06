Vue.component('minecraft-mod', {
  props: {
    mod: Object
  },
  template:
    '<li class="w3-bar">\
      <img src="https://media.forgecdn.net/avatars/54/432/636135140666602633.png" class="w3-bar-item w3-hide-small" style="width:85px">\
      <div class="w3-bar-item">\
        <input :id="mod.name[0]" type="checkbox" v-model="mod.selected">\
        <label class="w3-large" :for="mod.name[0]">{{ mod.name[1] }}</label><br>\
        <div :class="{\'version-radio-select\': true, version: true, modNotChosen: !mod.selected}">\
          <template v-for="version in mod.versions":key="modId(mod, version)">\
            <input :disabled="!mod.selected" type="radio" :id="modId(mod, version)" :name="modId(mod, version)"  v-model="mod.versionSelected" :value="version">\
            <label :for="modId(mod, version)">{{ version }}</label>\
          </template>\
        </div>\
      </div>\
    </li>',
  methods: {
    modId: function(mod, version) {
      return String(mod.name[1] + '-' + version.replace(/\./g,''))
    }
  }
})