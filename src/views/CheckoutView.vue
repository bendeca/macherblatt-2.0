<script setup>
import Checkout from "../components/Checkout.vue";
export default {
  components: {
    Checkout
  }
};
</script>

<template>
  <div class="header"></div>
  <checkout :userId="$route.query.userId" />
</template>

<style>
@import "../assets/base.css";
</style>
