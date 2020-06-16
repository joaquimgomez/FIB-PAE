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
          //organization: "",
          startDate: "",
          endDate: ""
        },
        combo:{
          polls: [],
          centers: [],
          //organizations: []
        },
        //END filter      

        //Table
        tableData: [],
        columns: [
          {
            prop: "centr_id", 
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
        questions: [],
        ruleFormStats: {
          question: ""
        },
        comboStats: {
          questions: [],
        },

        series: [100],
        chartOptions: {
          chart: {
            type: 'pie',
          },
          labels: ['loading'],
          responsive: [{
            breakpoint: 480,
            options: {
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
    resetForm(){
      this.ruleForm.center = "";
      //this.ruleForm.organization = "";
      this.ruleForm.startDate = "";
      this.ruleForm.endDate = "";
    },
    loadTable(){
      var idPoll = "";
      if(this.ruleForm.poll) idPoll = this.ruleForm.poll.id;
      
      axios.get("http://localhost:3000/realizedPoll"
              + "?pollId=" + idPoll
              + "&org=" + ((this.ruleForm.center)?this.ruleForm.center:"")
              + "&dateIni=" + ((this.ruleForm.startDate)?this.ruleForm.startDate:"")
              + "&dateFin=" + ((this.ruleForm.endDate)?this.ruleForm.endDate:"")
      )
      .then(response => {
        console.log("response realized polls: ", response.data);
        this.tableData = response.data; 
      })
      .catch(error => {
        this.launchNotify("Error", "Error al hacer get de las realized polls", "error");
        console.log(error);
      });
    },
    search(){
      this.loadTable();
    },
    pollChange(){
      this.loadQuestions();
    },
    loadQuestions(){
      var self = this;
      //Fill questions combo
      axios.get(
        "http://localhost:3000/poll/" + self.ruleForm.poll.id
      )
      .then(response => {
        this.questions = response.data.questions;

        this.comboStats.questions = [];        
        response.data.questions.forEach(q => {
          if(q.defined_answers == 1) this.comboStats.questions.push(q.body);
        });      
      })
      .catch(error => {
        this.launchNotify("Error", "Error al hacer get de las preguntas de la poll", "error");
        console.log(error);
      });
    },
    loadQuestionChart(){
      //this.series
      this.series = [];
      this.chartOptions.labels = [];
      var labels = [];

      this.questions.forEach(q => {
        if(q.body == this.ruleFormStats.question) {
          console.log("Entra en el if: ", q);
          q.answers.forEach(a => {
            console.log("Answer: ", a.body);
            
            
            labels.push(a.body);
            //TODO cambiar por los valores cuando este el get hecho
            this.series.push(a.id);
          });
        }
      });

      this.chartOptions = {
        chart: {
          type: 'pie',
        },
        labels: labels,
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom'
            }
          }
        }]
      }
    }
  },
  mounted(){
    //Fill polls combo
    axios.get(
      "http://localhost:3000/poll"
    )
    .then(response => {
      response.data.forEach(p => {
        this.combo.polls.push({id: p.id, name: p.name});
      });
      this.ruleForm.poll = {id: this.combo.polls[0].id, name: this.combo.polls[0].name };
      
      this.loadQuestions(); 
    })
    .catch(error => {
      this.launchNotify("Error", "Error al hacer get de las polls", "error");
      console.log(error);
    });

    //Fill centers combo
    axios.get(
      "http://localhost:3000/center"
    )
    .then(response => {
      response.data.forEach(c => {
        this.combo.centers.push(c.name);
      });      
    })
    .catch(error => {
      this.launchNotify("Error", "Error al hacer get de las organizaciones", "error");
      console.log(error);
    });

  } 
}
</script>

<template src="./StatsComponent.html"></template>    
<style src="./StatsComponent.css"></style>