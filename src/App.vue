<template>
    <Header></Header>
    <router-view></router-view> 
  </template>
  
  <script setup>
  import Header from "./components/header.vue"
  import { createWebHistory, createRouter } from "vue-router"; 
  import Authorization from "./pages/authorization.vue";
  import Main from "./pages/main.vue";
  import Developers from "./pages/developers.vue";
  const routes = [
    { path: '/', component: Main },
    { path: '/authorization', component: Authorization },
    { path: '/dev', component: Developers}
  ]
  
  const router = createRouter({
    history: createWebHistory(), 
    routes,
  })

  </script>