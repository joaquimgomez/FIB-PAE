<script>
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import { mapState } from 'vuex';

Vue.use(VueAxios, axios)
Vue.use(Vuex)

export default {
  name: 'StatsComponent',
  data () {
      return {
      }
  },
  computed: {
    ...mapState([
    ])
  },
  async mounted(){
  },

  components:{ }

}
</script>

<template src="./StatsComponent.html"></template>    
<style src="./StatsComponent.css"></style>