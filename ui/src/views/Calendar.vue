<template>
  <div>
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
    <router-link class="create" to="/create">Create</router-link>
    <button @click="logout">logout</button>
    <h1>Calendar</h1>
    <div class="calendar">
      <SingleDatePicker />
    </div>
  </div>
</template>

<script>
import SingleDatePicker from "vue-single-date-picker";

export default {
  components: {
    SingleDatePicker,
  },
  methods: {
    logout() {
      console.log("logout");
      this.$router.push({ name: "Welcome" });
    },
    viewDay() {},
  },
};
</script>

<style scoped>
@import "~vue-single-date-picker/dist/vue-single-date-picker.css";

.single-date-picker__calendar-view {
  max-width: 400px;
}

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

h1 {
  margin-top: 4rem;
  margin-bottom: 2rem;
}
</style>
