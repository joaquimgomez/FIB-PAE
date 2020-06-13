import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    // {
    //   path: "/",
    //   alias: "/tutorials",
    //   name: "tutorials",
    //   component: () => import("./components/TutorialsListComponent/TutorialsListComponent")
    // },
    // {
    //   path: "/tutorials/:id",
    //   name: "tutorial-details",
    //   component: () => import("./components/TutorialComponent/TutorialComponent")
    // },
    // {
    //   path: "/add",
    //   name: "add",
    //   component: () => import("./components/AddTutorialComponent/AddTutorialComponent")
    // },
    {
      path: "/app",
      name: "dashboard",
      component: () => import("./components/DashboardComponent/DashboardComponent")
    },
    // {
    //   path: "/app",
    //   name: "main",
    //   component: () => import("./components/MainComponent/MainComponent")
    // },
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
