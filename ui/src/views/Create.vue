<template>
  <div>
    <router-link class="calendar" to="/calendar">Calendar</router-link
    ><button @click="logout">logout</button>
    <h1>Create</h1>
    <h2>New Event</h2>
    <form @submit.prevent="submit">
      <input type="text" v-model="form.name" placeholder="Name" />
      <input @input="form.date = $event.target.value" placeholder="Date" />
      <input
        @input="form.location = $event.target.value"
        placeholder="Location"
      />
      <input
        @input="form.description = $event.target.value"
        placeholder="Description"
      />
      <div class="flex justify-end">
        <input type="submit" value="Save Event" />
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        date: "",
        location: "",
        description: "",
      },
    };
  },
  methods: {
    async submit() {
      if (!this.form.name || !this.form.location || !this.form.date) return;
      await this.$store.dispatch("createEvent", this.form);
      this.$router.push({ name: "Calendar" });
    },
    logout() {
      console.log("logout");
      this.$router.push({ name: "Welcome" });
    },
  },
};
</script>

<style scoped>
.calendar {
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

form {
  margin-top: 2rem;
}
</style>
