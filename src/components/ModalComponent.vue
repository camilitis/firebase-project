<template>
  <transition name="fade">
    <div class="modal" v-if="show">
      <div class="modal__backdrop" @click="closeModal()"/>

      <div class="modal__dialog">
        <div class="modal__header">
          <vue-feather @click="closeModal()" type="x" class="modal__close"></vue-feather>
        </div>

        <div class="modal__body">
          <slot name="body"/>
        </div>

      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "ModalComponent",
  data() {
    return {
      show: false
    };
  },
  methods: {
    closeModal() {
      this.show = false;
      document.querySelector("body").classList.remove("overflow-hidden");
    },
    openModal() {
      this.show = true;
      document.querySelector("body").classList.add("overflow-hidden");
    }
  }
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  overflow-x: hidden;
  overflow-y: auto;
  &__backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 60;
  }
  &__dialog {
    position: relative;
    width: 200px;
    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 4px 3px 7px 2px #00000040;
    margin: 100px auto;
    display: flex;
    flex-direction: column;
    z-index: 60;
    padding: 2rem;
    box-sizing: content-box;
  }
  &__body {
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>