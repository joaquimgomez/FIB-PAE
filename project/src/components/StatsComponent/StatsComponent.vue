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
        tableData: [],
        columns: [
          {
            prop: "question", 
            label: "Pregunta", 
            width: 400
          },
          { 
            label: "Respuesta", 
            minwidth: 50, 
            sortable: true,
            slotName: "answer" ,
            show: false
          },
          {
            label: "Problema", 
            width: 200,
            slotName: "problem",
            required: true
          },
          {
            label: "Medida", 
            width: 200,
            slotName: "measure"
          },
          {
            label: "Comentario", 
            width: 200,
            slotName: "comment"
          }
        ],
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
  },
  mounted(){
  },

  components:{ }

}
</script>

<template src="./StatsComponent.html"></template>    
<style src="./StatsComponent.css"></style>