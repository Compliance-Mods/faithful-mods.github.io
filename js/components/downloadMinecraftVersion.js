Vue.component('download-minecraft-version', {
  props: {
    value: Object,
  },
  template: '<button type="button" class="btn btn-primary minecraftVersion mb-1 mr-1" :value="value.version" @click="dv" >{{ value.version + \'<span class="badge badge-light" style="color: black;">\' + value.count + \'</span>\' }}</button>',
  data() {
    return {}
  },
  methods: {
    dv: function() {
      if(this.$parent && !!this.$parent.downloadVersion)
        this.$parent.downloadVersion(this.value.version)
    }
  }
});