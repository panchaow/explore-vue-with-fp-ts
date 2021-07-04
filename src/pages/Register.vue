<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign Up</h1>
          <p class="text-xs-center">
            <router-link to="/login">Have an account?</router-link>
          </p>

          <list-errors :errors="errors"></list-errors>

          <register-form :inProgress="inProgress" @submit="onRegister" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ListErrors from "../components/ListErrors.vue";
import RegisterForm from "../components/RegisterForm.vue";
import useStore from "../composables/useStore";
import { defineComponent, computed } from "vue";
import { useRouter } from 'vue-router';
import * as E from 'fp-ts/Either';

export default defineComponent({
  components: { RegisterForm, ListErrors },
  setup() {
    const store = useStore();
    const router = useRouter();

    const inProgress = computed(() => store.state.register.inProgress)
    const errors = computed(() => store.state.register.errors)

    const onRegister = (payload: any) => {
      store.dispatch("register", payload).then(e => {
        if (E.isRight(e)) {
          router.push("/")
        }
      })
    }

    return {
      onRegister,
      inProgress,
      errors,
    }
  }
});

</script>
<style>

</style>