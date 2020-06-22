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
        showDialog: false,
        selectedAnswers: [],
        allAnswers: [],

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
          centers: []
        },
        //END filter      

        //Table
        tableData: [],
        columns: [
          {
            prop: "center_name", 
            label: "Center", 
            width: 100
          },
          {
            label: "Organization", 
            width: 110,
            prop: "org_name"
          },
          { 
            label: "Date", 
            width: 95, 
            sortable: true,
            prop: "date",
            formatter: (value) => {
              return new Date(value.date).toISOString().split('T')[0];
            }
          }, 
          { 
            label: "Details", 
            width: 70, 
            slotName: "details",
          },          
          
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
        },
        //END pie chart
             
    }
  },
  components:{ apexchart: VueApexCharts },
  computed: {
    ...mapState([ "answers"
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
      this.ruleForm.startDate = "";
      this.ruleForm.endDate = "";
    },
    loadTable(){
      this.tableData = [];

      var idPoll = "";
      if(this.ruleForm.poll) idPoll = this.ruleForm.poll.id;
      var url = "http://localhost:3000/realizedPoll"
              + "?pollId=" + idPoll
              + "&org=" + ((this.ruleForm.center)?this.ruleForm.center:"")
              + "&dateIni=" + ((this.ruleForm.startDate)?this.ruleForm.startDate:"")
              + "&dateFin=" + ((this.ruleForm.endDate)?this.ruleForm.endDate:"");
      
      axios.get(url
      )
      .then(response => {
        this.tableData = response.data; 

        //Get all answers
        this.tableData.forEach(poll => {
          var jsonAnswers = JSON.parse(poll.respuestas);
          var oneAnswers = this.getAnswers(idPoll, jsonAnswers);
          this.allAnswers.push(oneAnswers);
        });
      })
      .catch(error => {
        //this.launchNotify("Error", "Error al hacer get de las realized polls", "error");
        console.log(error);
      });     
       
    },
    search(){
      this.loadTable();
    },
    pollChange(){
      this.loadQuestions();
      this.loadTable();
    },
    loadQuestions(){
      var self = this;
      
      axios.get(
        "http://localhost:3000/poll/" + self.ruleForm.poll.id
      )
      .then(response => {
        this.questions = response.data.questions;

        this.comboStats.questions = [];      
        response.data.questions.forEach(q => {
          if(q.defined_answers == 1) {
            this.comboStats.questions.push(q.body);
          }          
        });

      })
      .catch(error => {
        this.launchNotify("Error", "Error al hacer get de las preguntas de la poll", "error");
        console.log(error);
      });
    },
    openDialog(row){
      this.$store.commit("setIdQuestionnaire", row.enc_id);
      var jsonAnswers = JSON.parse(row.respuestas);
      this.showDialog = true;

      this.selectedAnswers = this.getAnswers(row.enc_id, jsonAnswers);      
    },
    getAnswers(enc_id, jsonAnswers){
      var answers = [];

      axios.get(
        "http://localhost:3000/poll/" + enc_id
      )
      .then(response => {
        var data_questions = response.data.questions;
        var index = 0;
        data_questions.forEach(q => {
          answers.push({
            question: q.body,
            answer: jsonAnswers[index].answer_question
          })
          ++index;
        });
        
      })
      .catch(error => {
        //this.launchNotify("Error", "Error al hacer get de las preguntas de la encuesta", "error");
        console.log(error);
      });
      return answers;
    },
    loadQuestionChart(){
      //this.series
      this.series = [];
      this.chartOptions.labels = [];
      var labels = [];

      this.questions.forEach(q => {
        if(q.body == this.ruleFormStats.question) {
          q.answers.forEach(a => {
            labels.push(a.body);

            var count = 0;
            this.allAnswers.forEach(answers => {
              answers.forEach(answ => {
                if(answ.answer == a.body && answ.question == q.body) {
                  ++count;
                }
              });
            });
            this.series.push(count);
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
      this.loadTable();
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
        this.combo.centers.push({
          id: c.id,
          name: c.name
        });
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