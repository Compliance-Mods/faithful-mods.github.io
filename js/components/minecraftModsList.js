Vue.component('minecraft-mod-list', {
  props: {
    mods: Object,
  },
  template: 
    '<ul class="w3-ul w3-card-4">\
      <minecraft-mod v-for="mod in mods" :key="mod.name[1]" :mod="mod"></minecraft-mod>\
    </ul>'
})