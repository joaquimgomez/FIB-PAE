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
        age: "44"
      },

      questions:[
        {
          index: "0",
          question_label: "Question 1 de prueba",
          type: "",
          checkBoxes: ["Uno", "Dos", "Tres"],
          checkBox_selected: "",
          answer: ""
        }
      ]

      
    }
    
  },
  components: {},
  computed: {
    ...mapState([
    ])
  },
  methods: {
    saveForm(){
      var aux = this.questions[0];
      console.log("Contenido de la pregunta: ", aux);
    }
  },
  mounted(){
    this.questions.push({
      index:"1",
      question_label: "Question 2 de prueba",
      type:"",
      checkBoxes: ["Uno", "Dos", "Tres"],
      checkBox_selected: "",
      answer:""
    })
  }
};

</script>

<template src="./QuestionnaireComponent.html"></template>    
<style src="./QuestionnaireComponent.css"></style>

