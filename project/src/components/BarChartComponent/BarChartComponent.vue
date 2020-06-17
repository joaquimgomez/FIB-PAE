<script>
/**
 * Import Vue and Axios for request api intranet
 */
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import { mapState } from 'vuex';
import VueApexCharts from 'vue-apexcharts'

Vue.component('apexchart', VueApexCharts);
Vue.use(VueAxios, axios)
Vue.use(Vuex)

/**
 * Export component Main, the father component in the aplication
 */
export default {
  name: 'BarChartComponent',
  data () {
      return {
         //Bars chart
          barSeries: [{
            name: 'Inflation',
            data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
          }],
          barChartOptions: {
            chart: {
              id: 'barChart',
              height: 350,
              type: 'bar',
            },
            plotOptions: {
              bar: {
                dataLabels: {
                  position: 'top', // top, center, bottom
                },
              }
            },
            dataLabels: {
              enabled: true,
              formatter: function (val) {
                return val + "%";
              },
              offsetY: -20,
              style: {
                fontSize: '12px',
                colors: ["#304758"]
              }
            },
            
            xaxis: {
              categories: this.getCategories(),
              position: 'top',
              axisBorder: {
                show: false
              },
              axisTicks: {
                show: false
              },
              crosshairs: {
                fill: {
                  type: 'gradient',
                  gradient: {
                    colorFrom: '#D8E3F0',
                    colorTo: '#BED1E6',
                    stops: [0, 100],
                    opacityFrom: 0.4,
                    opacityTo: 0.5,
                  }
                }
              },
              tooltip: {
                enabled: true,
              }
            },
            yaxis: {
              axisBorder: {
                show: false
              },
              axisTicks: {
                show: false,
              },
              labels: {
                show: false,
                formatter: function (val) {
                  return val + "%";
                }
              }
            
            },
            title: {
              text: 'Popular answers',
              floating: true,
              offsetY: 330,
              align: 'bottom',
              style: {
                color: '#444'
              }
            }
          //END bars chart
      }
    }
  },
  props: ['categories', 'series'],
  computed: {
    ...mapState([
    ])
  },
  methods: {
    getCategories(){
      console.log("cat: ", this.categories);
      return this.categories;
    }
  },
  mounted(){
  },

}
</script>

<template src="./BarChartComponent.html"></template>    
<style src="./BarChartComponent.css"></style>