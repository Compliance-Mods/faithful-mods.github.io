Vue.component('download-minecraft-version', {
  props: {
    value: String,
  },
  template: '<button type="button" class="btn btn-primary minecraftVersion mb-1 mr-1" :value="value" @click="dv" >{{ value }}</button>',
  data() {
    return {}
  },
  methods: {
    dv: function() {
      if(this.$parent && !!this.$parent.downloadVersion)
        this.$parent.downloadVersion(this.value)
    }
  }
});