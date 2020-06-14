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
import ElTablePagination from 'el-table-pagination'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'


Vue.use(VueAxios, axios)
Vue.use(Vuex)
Vue.use(ElTablePagination, {locale})
Vue.use(ElementUI, { locale })

/**
 * Export component Main, the father component in the aplication
 */
export default {
  name: 'DashboardComponent',
  data () {
      return {
        showDialog: false,
        tableData: [],
        columns: [
        { 
          label: "Questionnaire", 
          width: 150, 
          sortable: true,
          prop: "name" 
        },
        { 
          label: "Organization", 
          width: 130, 
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
    ...mapState([ "id_questionnaire"
    ])
  },
  methods:{
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
    setQuestionnaire(index,row){
      this.$store.commit("setIdQuestionnaire", row.id);
      this.$router.push('/app/questionnaire');
    }
  },
  mounted(){
    var self = this;
    axios.get(
        "http://localhost:3000/poll"
      )
      .then(response => {
        var data = response;
        console.log("response data: ", data);
        
        data.forEach(q => {
          self.tableData.push({
            id: q.id,
            name: q.name,
            organization: q.org_name,
            date: new Date(q.created_at).toISOString().split('T')[0]
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