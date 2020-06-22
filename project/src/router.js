import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/app",
      name: "dashboard",
      component: () => import("./components/DashboardComponent/DashboardComponent")
    },
    {
       path: "/app/newquestionnaire",
       name: "newquestionnaire",
       component: () => import("./components/NewQuestionnaireComponent/NewQuestionnaireComponent")
    },
    {
      path: "/app/questionnaire",
      name: "questionnaire",
      component: () => import("./components/QuestionnaireComponent/QuestionnaireComponent")
    },
    {
      path: "/app/stats",
      name: "stats",
      component: () => import("./components/StatsComponent/StatsComponent")
    }
  ]
});
