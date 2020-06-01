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
import "element-ui/lib/theme-chalk/index.css";


Vue.use(VueAxios, axios)
Vue.use(Vuex)

/**
 * Export component Main, the father component in the aplication
 */
export default {
  name: 'DashboardComponent',
  data () {
      return {
        showDialog: true,
        tableData: [],
        columns: [
        { 
          label: "Name questionnaire", 
          width: 60, 
          sortable: true,
          prop: "name" 
        },
        { 
          label: "Organization", 
          width: 80, 
          sortable: true,
          prop: "organization" 
        },
        {
          label: "Date", 
          width: 100,
          prop: "date",
          sortable: true
        }
        ],
        loading: false
      }
  },
  computed: {
    ...mapState([
    ])
  },
  methods:{
    onSortChange(order) {
      this.tableData = this.tableData.sort(function(a, b) {
        if (order.order == "descending") return b[order.prop] - a[order.prop];
        else return a[order.prop] - b[order.prop];
      });
    }
  },
  mounted(){
    var self = this;
    axios.get(
        "http://localhost:3000/poll"
      )
      .then(response => {
        var data = response.data;
        console.log("response data: ", data);

        data.forEach(q => {
          self.tableData.push({
            id: q.id,
            name: q.name,
            organization: q.org_name,
            date: q.created_at
          })
        });
      })
      .catch(error => {
        this.launchNotify("Error", "Error al hacer get all de las encuestas", "error");
        console.log(error);
      });
  },

  components:{    
    QuestionnaireComponent
  }

}
</script>

<template src="./DashboardComponent.html"></template>    
<style src="./DashboardComponent.css"></style>