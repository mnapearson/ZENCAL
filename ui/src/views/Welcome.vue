<template>
  <div>
    <h1>ZenCal</h1>

    <form @submit.prevent="submit">
      <input
        class="email"
        type="text"
        name="email"
        v-model="form.email"
        placeholder="email"
      /><input
        class="password"
        type="password"
        name="password"
        v-model="form.password"
        placeholder="password"
      />
      <input class="signup" type="submit" :value="mode" />
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      mode: "Sign In",
    };
  },
  methods: {
    // async signup() {
    //   await this.$store.dispatch("signup", this.form);
    //   this.$router.push({ name: "Create" });
    // },
    // async signin() {
    //   await this.$store.dispatch("signin", this.form);
    //   this.$router.push({ name: "Calendar" });
    // },
    async submit() {
      if (this.form.email && this.form.password) {
        try {
          await this.$store.dispatch(
            this.mode == "sign in" ? "signin" : "signup",
            this.form
          );
          this.$router.push({ name: "Calendar" });
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
};
</script>

<style>
* {
  margin: 0 auto;
  font-family: "Permanent Marker", cursive;
  color: black;
}

h1 {
  margin: 5rem auto;
  font-size: 60px;
}

form {
  margin: 6rem auto;
  display: grid;
  grid-template: row;
  row-gap: 2rem;
  position: center;
}

.email {
  border: none;
  outline: none;
  background: white;
  border-bottom: 1px solid black;
}
.password {
  border: none;
  outline: none;
  background: white;
  border-bottom: 1px solid black;
}

.submit {
  margin-top: 3rem;
  border: none;
  outline: none;
  background: white;
}
</style>
