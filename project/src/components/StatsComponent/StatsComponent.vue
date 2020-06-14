<script>
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import { mapState } from 'vuex';
import ElSearchTablePagination from "el-search-table-pagination";
import VueApexCharts from 'vue-apexcharts'

Vue.component('apexchart', VueApexCharts);
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
          organizations: [],
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

        //pie chart
        comboStats: {
          questions: [],
        },

        series: [44, 55, 13, 43, 22],
        chartOptions: {
          chart: {
            //width: 380,
            type: 'pie',
          },
          labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                //width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        }
        //END pie chart
    }
  },
  components:{ apexchart: VueApexCharts },
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
    //Fill polls combo
    axios.get(
      "http://localhost:3000/poll"
    )
    .then(response => {
      response.data.forEach(p => {
        this.combo.polls.push(p.name);
      });
      this.ruleForm.poll = this.combo.polls[0];      
    })
    .catch(error => {
      this.launchNotify("Error", "Error al hacer get de las polls", "error");
      console.log(error);
    });

    //Fill organizations combo
    axios.get(
      "http://localhost:3000/organization"
    )
    .then(response => {
      response.data.forEach(o => {
        this.combo.organizations.push(o.name);
      });      
    })
    .catch(error => {
      this.launchNotify("Error", "Error al hacer get de las organizaciones", "error");
      console.log(error);
    });

  },

  

}
</script>

<template src="./StatsComponent.html"></template>    
<style src="./StatsComponent.css"></style>