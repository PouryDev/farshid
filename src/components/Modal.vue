<script setup>
defineProps({
  name: String,
  show: Boolean,
  title: String,
  type: {
    default: 'regular',
    type: String,
  },
  onSuccess: {
    required: false,
    type: Function,
  },
  onSuccessArgs: {
    required: false,
    type: Array,
  }
})

</script>

<template>
  <dialog :id="name" class="modal" :open="show" style="text-align: left!important;">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ $props.title }}</h3>
      <slot></slot>
      <div class="modal-action">
        <form method="dialog">
          <button @click="$emit('update')" v-if="$props.type === 'regular'" class="btn">Close</button>
          <div v-else>
            <button @click="$emit('update')" style="margin-right: 12px" class="btn btn-error">Cancel</button>
            <button class="btn btn-success"
                    @click="$props.onSuccess.apply(null, $props.onSuccessArgs); $emit('update')"
            >OK</button>
          </div>
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped>

</style>