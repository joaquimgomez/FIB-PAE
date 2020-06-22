<script>
/**
 * Import Vue and Axios for request api intranet
 */
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
//import HeaderComponent from '@/components/HeaderComponent/HeaderComponent'
import QuestionnaireComponent from '@/components/QuestionnaireComponent/QuestionnaireComponent'
import { mapState } from 'vuex';

Vue.use(VueAxios, axios)
Vue.use(Vuex)

/**
 * Export component Main, the father component in the aplication
 */
export default {
  name: 'MainComponent',
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

  components:{    
    QuestionnaireComponent
  }

}
</script>

<template src="./MainComponent.html"></template>    
<style src="./MainComponent.css"></style>