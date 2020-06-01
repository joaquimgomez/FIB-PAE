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
  name: 'DashboardComponent',
  data () {
      return {
        showDialog: false,
        tableData: []
      }
  },
  computed: {
    ...mapState([
    ])
  },
  methods:{

  },
  mounted(){

  },

  components:{    
    QuestionnaireComponent
  }

}
</script>

<template src="./DashboardComponent.html"></template>    
<style src="./DashboardComponent.css"></style>