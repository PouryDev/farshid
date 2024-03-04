<script setup>
import {onMounted, ref} from "vue";

const html = ref(null);
onMounted(() => {
  html.value = document.documentElement
})

const changeTheme = () => {
  const theme = html.value.getAttribute('data-theme')
  if (theme == null || theme === 'dark') {
    html.value.setAttribute('data-theme', 'cupcake')
    return;
  }
  html.value.setAttribute('data-theme', 'dark')

}
</script>

<template>
  <div class="navbar bg-primary text-black rounded shadow-xl"
       style="margin: 20px auto 0 auto; width: 90%; justify-content: center">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl">NOC Notifier</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li><a @click="changeTheme">Change theme</a></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>