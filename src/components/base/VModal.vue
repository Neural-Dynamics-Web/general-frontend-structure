<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue';

const isOpen = ref<boolean>(false);

const props = withDefaults(
  defineProps<{
    noscroll?: boolean;
    noclose?: boolean;
  }>(),
  {
    noscroll: false,
    noclose: false,
  }
);

const open = (): void => {
  isOpen.value = true;
};
const close = (): void => {
  isOpen.value = false;
};

watch(
  () => isOpen,
  () => {
    if (isOpen) {
      if (props.noscroll) document.body.classList.add("noscroll");
    } else {
      document.body.classList.remove("noscroll");
    }
  }
);
onUnmounted(() => props.noscroll && document.body.classList.remove("noscroll"));

defineExpose({
  isOpen,
  open,
  close
});
</script>

<template>
  <teleport to="body">
    <transition name="fade-slow">
      <div class="modal" v-if="isOpen">
        <div class="modal-content">
          <div class="modal-card">
            <slot />
          </div>
          <span v-if="!noclose" class="modal-close" @click="close()"></span>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, .4);
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-content {
    min-width: 20vw;
    max-width: 99vw;
    max-height: 99vh;
    position: relative;

    .modal-card {
      height: 100%;
      width: 100%;
      background-color: #fff;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      text-align: center;
      padding: 20px 40px;
    }

    .modal-close {
      display: block;
      position: absolute;
      height: 30px;
      width: 30px;
      top: 10px;
      right: 10px;
      background-color: #fff;
      cursor: pointer;
      border-radius: 50%;

      &::before,
      &::after {
        content: '';
        position: absolute;
        display: block;
        width: 15px;
        height: 2px;
        background-color: #000000;
        top: calc(50% - 1px);
        left: calc(50% - 5px);
        transition: .3s transform;
      }

      &::before {
        transform: rotate(45deg);
      }

      &::after {
        transform: rotate(-45deg);
      }
    }
  }
}
</style>