<template>
  <div>
    <router-link class="create" to="/create">Create</router-link>
    <button @click="logout">logout</button>
    <h1>Calendar</h1>
    <h2>Today's Tasks</h2>
    <h2>Today's Events</h2>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      console.log("logout");
      this.$router.push({ name: "Welcome" });
    },
  },
};
</script>

<style scoped>
.create {
  margin: 0 10rem;
  border: none;
  outline: none;
  background: white;
  text-decoration: none;
  font-size: 24px;
}

button {
  margin: 0 10rem;
  border: none;
  outline: none;
  background: white;
  font-size: 24px;
}
</style>
