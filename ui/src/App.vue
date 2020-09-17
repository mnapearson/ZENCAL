<template>
  <div id="app">
    <button v-if="$store.state.user" class="welcome" @click="$store.dispatch('logout')">Logout</button>
    <router-view />
    <div class="notification">
      <div
        class="container"
        @click="$store.commit('REMOVE_NOTIFICATION', notification.id)"
        v-for="notification in $store.state.notifications"
        :key="notification.id"
      >{{ notification.text }}</div>
    </div>
  </div>
</template>



<style>
</style>
