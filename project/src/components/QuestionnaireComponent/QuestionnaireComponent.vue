<script>
//import { Form as ElForm } from "element-ui";
//import ElementUI from "element-ui";
import Vue from "vue";
import Vuex from "vuex";
import { mapState } from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";
import "element-ui/lib/theme-chalk/index.css";
import { WebCam } from "vue-web-cam";

Vue.use(VueAxios, axios);
Vue.use(Vuex);

export default {
  name: "QuestionnaireComponent",
  data() {
    return {
      name__view: "Questionnaire",
      name__questionnaire: "",

      /*Photo*/
      showDialogCamera: false,
      img: null,
      camera: null,
      deviceId: null,
      devices: [],

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
      // src_images: [ 
      //   { img: require('../../assets/icons/happy.png') },
      //   { img: require('../../assets/icons/neutral.png') },
      //   { img: require('../../assets/icons/sad.png') }
      // ]
      src_images: [ 
        require('../../assets/icons/happy.png'),
        require('../../assets/icons/neutral.png'),
        require('../../assets/icons/sad.png')
      ],
      labels_images: ["Happy", "Neutral", "Sad"]
    }
    
  },
  components: { 'vue-web-cam': WebCam },
  computed: {
    ...mapState([ "id_questionnaire"
    ]),
    device: function() {
        return this.devices.find(n => n.deviceId === this.deviceId);
    }
  },
   watch: {
      camera: function(id) {
          this.deviceId = id;
      },
      devices: function() {
          // Once we have a list select the first one
          const [first] = this.devices;
          if (first) {
              this.camera = first.deviceId;
              this.deviceId = first.deviceId;
          }
      }
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

      var self = this;
      axios.post("http://localhost:3000/realizedPoll",
      {
        id: "",
        user_id: self.result.user_id,
        enc_id: self.result.enc_id,
        centr_id: self.result.centr_id,
        enq_id: self.result.enq_id,
        date: self.result.date,
        respuestas: self.result.respuestas
      })
      .then(response => {
        console.log("OK", response);
        this.launchNotify("Saved", "Answers saved succesfully", "success");
        this.$router.push('/app');
      })
      .catch(error => {
        this.launchNotify("Error", "Error al hacer post de la enquesta", "error");
        console.log(error);
      });
    },
    showCamera(){
      this.showDialogCamera = true;
    },
    onCapture() {
      var self = this;
      this.img = this.$refs.webcam.capture();
      
      var responsesTypes = [];
      this.questions.forEach(q => {
        responsesTypes.push(q.type);
      });

      axios.post("http://localhost:3000/uploadImage",
      {
        file: self.img,
        expected_data: responsesTypes
      })
      .then(response => {
        console.log("Take photo works", response);
      })
      .catch(error => {
        this.launchNotify("Error", "Error al hacer post de la foto", "error");
        console.log(error);
      });

    },
    onStarted(stream) {
        console.log("On Started Event", stream);
    },
    onStopped(stream) {
        console.log("On Stopped Event", stream);
    },
    onStop() {
        this.$refs.webcam.stop();
    },
    onStart() {
        this.$refs.webcam.start();
    },
    onError(error) {
        console.log("On Error Event", error);
    },
    onCameras(cameras) {
        this.devices = cameras;
        console.log("On Cameras Event", cameras);
    },
    onCameraChange(deviceId) {
        this.deviceId = deviceId;
        this.camera = deviceId;
        console.log("On Camera Change Event", deviceId);
    }
  },
  mounted(){
    var self = this;
    
    console.log("id_ques", this.id_questionnaire);

    var url = "http://localhost:3000/poll/" + this.id_questionnaire;
    console.log("URL: ", url);

    //Call get poll
    axios.get(
        url
      )
      .then(response => {
        var data = response.data;

        console.log("Data: ", response);
        //Save questionnaire name
        self.name__questionnaire = data.name;

        //Save data questionnaire
        //TODO datos hardcoded
        this.result.user_id = 1;
        this.result.enc_id = data.id;
        this.result.centr_id = 1;
        this.result.enq_id = 1;

        var data_questions = data.questions;

        data_questions.forEach(q => {
          var data_checkBoxes = [];
          var data_type = "";
          if(q.defined_answers == 0){
            data_type = "text";
          }
          else{
            data_type = "checkbox";
            q.answers.forEach(a => {
              //If answer have an image
              if(a.image){
                data_type = "image";
                data_checkBoxes.push({
                  body: a.body, 
                  image: self.src_images[(a.id - 1)]
                });
              }
              else{
                data_checkBoxes.push({
                  body: a.body, 
                  image: ""
                });
              } 
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

