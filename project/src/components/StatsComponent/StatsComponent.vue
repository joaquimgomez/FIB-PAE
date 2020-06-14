<script>
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import { mapState } from 'vuex';
import ElSearchTablePagination from "el-search-table-pagination";

Vue.use(VueAxios, axios);
Vue.use(Vuex);
Vue.use(ElSearchTablePagination);

export default {
  name: 'StatsComponent',
  data () {
      return {
        //Filter
        labels:{
          poll:"Questionnaire",
          center: "Center",
        },
        ruleForm:{
          poll: "",
          center: "",
          startDate: "",
          endDate: ""
        },
        combo:{
          polls: [],
          centers: [],
        },
        //END filter      

        //Table
        tableData: [],
        columns: [
          {
            prop: "center", 
            label: "Center", 
            width: 100
          },
          { 
            label: "Date", 
            width: 100, 
            sortable: true,
            prop: "date",
          },          
          {
            label: "Núm. answers", 
            width: 150,
            prop: "numAnswers"
          }
        ],
        //END table
      }
  },
  computed: {
    ...mapState([
    ])
  },
  methods: {
    launchNotify(title, message, type) {
      this.$notify({
        title: title,
        message: message,
        type: type
      });
    },
    onSortChange(order) {
      this.tableData = this.tableData.sort(function(a, b) {
        if (order.order == "descending") return b[order.prop] - a[order.prop];
        else return a[order.prop] - b[order.prop];
      });
    },
    loadTable(){

    },
    search(){
      
    }
  },
  mounted(){

    axios.get(
        "http://localhost:3000/organization"
      )
      .then(response => {
        console.log("response: ", response);
        
      })
      .catch(error => {
        this.launchNotify("Error", "Error al hacer get de las organizaciones", "error");
        console.log(error);
      });
  },

  components:{ }

}
</script>

<template src="./StatsComponent.html"></template>    
<style src="./StatsComponent.css"></style>