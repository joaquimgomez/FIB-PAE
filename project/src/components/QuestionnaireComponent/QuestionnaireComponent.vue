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
        respuestas: []
      },

      fit: 'contain',
      src_images: [ 
        { img: require('../../assets/icons/happy.png') },
        { img: require('../../assets/icons/neutral.png') },
        { img: require('../../assets/icons/sad.png') }
      ]
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
      var date = new Date(Date.now()).toISOString().split('T')[0];
      this.result.date = date;
      
      this.questions.forEach(q => {
        this.result.respuestas.push({
          answer_question: (q.type == "text")? q.answer:q.checkBox_selected
        })
      });

      console.log("Result: ", this.result);
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
        var data = response.data;
        //Save data questionnaire
        this.result.user_id = 0;
        this.result.enc_id = data.id;
        this.result.centr_id = 0;
        this.result.enq_id = 0;

        var data_questions = response.data.questions;

        data_questions.forEach(q => {
          var data_checkBoxes = [];
          var data_type = "";
          if(q.defined_answers == 0){
            data_type = "text";
          }
          else{
            data_type = "checkbox";
            q.answers.forEach(a => {
              data_checkBoxes.push(a.body);
              //If answer have an image
              if(a.image) data_type = "image";
            });
          }
          
          self.questions.push({
            index: q.id,
            question_label: q.body,
            type: data_type,
            checkBoxes: (data_type == "image")? self.src_images:data_checkBoxes,
            checkBox_selected: "",
            answer:""
          })
        });
        
      })
      .catch(error => {
        this.launchNotify("Error", "Error al hacer get de la encuesta", "error");
        console.log(error);
      });


      //TODO prueba pregunta con imagenes
      // this.questions.push({
      //   index: 4,
      //   question_label: "Prueba pregunta con imagenes",
      //   type: "image",
      //   checkBoxes: self.src_images,
      //   checkBox_selected: "",
      //   answer:""
      // });
  }
};

</script>

<template src="./QuestionnaireComponent.html"></template>    
<style src="./QuestionnaireComponent.css"></style>

