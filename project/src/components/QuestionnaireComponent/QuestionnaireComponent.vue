<script>
//import { Form as ElForm } from "element-ui";
//import ElementUI from "element-ui";
import Vue from "vue";
import Vuex from "vuex";
import { mapState } from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";
import "element-ui/lib/theme-chalk/index.css";

//import TutorialDataService from "../../services/TutorialDataService";

Vue.use(VueAxios, axios);
Vue.use(Vuex)

export default {
  name: "QuestionnaireComponent",
  data() {
    return {
      name__view: "Questionnaire",

      labels:{
        name: "Name",
        age: "Age"
      },
      ruleForm: {
        name: "",
        age: ""
      },

      questions:[],

      result:{
        id: 0,
        user_id: 0, 
        enc_id: 0,
        centr_id: 0,
        enq_id: 0,
        date: "",
        respuestas: {}
      }

      
    }
    
  },
  components: {},
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
    saveForm(){
      var aux = this.questions[0];
      console.log("Contenido de la pregunta: ", aux);
    }
  },
  mounted(){
    var self = this;

    //Call get poll
    //TODO ahora hardcoded el id de la poll
    axios.get(
        "http://localhost:3000/poll/1"
      )
      .then(response => {
        var questions = response.data.questions;

        questions.forEach(q => {
          var data_checkBoxes = [];
          var data_type = "";
          if(q.defined_answers == 0){
            data_type = "text";
          }
          else{
            data_type = "checkbox";
            q.answers.forEach(a => {
              data_checkBoxes.push(a.body);
            });
          }
          
          self.questions.push({
            index: q.id,
            question_label: q.body,
            type: data_type,
            checkBoxes: data_checkBoxes,
            checkBox_selected: "",
            answer:""
          })
        });
        
      })
      .catch(error => {
        this.launchNotify("Error", "Error al hacer get de la encuesta", "error");
        console.log(error);
      });
  }
};

</script>

<template src="./QuestionnaireComponent.html"></template>    
<style src="./QuestionnaireComponent.css"></style>

