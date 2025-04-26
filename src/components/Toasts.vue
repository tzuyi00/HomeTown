<template>
  <div style="position: fixed; top: 85px; right: 20px; min-width: 300px; z-index: 11000;">
    <div
      v-for="(item, i) in messages"
      :id="`toast-${i}`"
      :key="i"
      class="toast fade show"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-autohide="false"
      :class="`bg-${ item.status }`"
    >
      <!-- <div class="toast-header">
        <div
          class="inline-block rounded mr-2"
          style="width: 20px; height: 20px"
          :class="`bg-${ item.status }`"
        />
        <strong class="mr-auto">light bakery</strong>

      </div> -->
      <div class="toast-body">
        {{ item.message }}
        <button
          type="button"
          class="ml-2 close"
          data-dismiss="toast"
          aria-label="Close"
          @click="closeToast(`toast-${i}`)"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */

export default {
  name: 'Toasts',
  data () {
    return {
      messages: []
    }
  },
  created () {
    const vm = this
    vm.$bus.$on('message:push', (message, status = 'warning') => {
      vm.updateMessage(message, status)
    })
  },
  methods: {
    updateMessage (message, status) {
      const timestamp = Math.floor(new Date() / 1000)
      this.messages.push({
        message,
        status,
        timestamp
      })
      this.removeMessageWithTiming(timestamp) // 五秒後移除該toast
    },
    removeMessage (num) {
      this.messages.splice(num, 1)
    },
    removeMessageWithTiming (timestamp) {
      const vm = this
      setTimeout(() => {
        vm.messages.forEach((item, i) => {
          if (item.timestamp === timestamp) {
            vm.messages.splice(i, 1)
          }
        })
      }, 5000)
    },
    closeToast (element) { // 隱藏toast
      $(`#${element}`).toast('hide')
    }
  },
  beforeUnmount: function () {
    // 元件銷毀前要註銷監聽事件
    this.$bus.$off('message:push')
  }
}
</script>

<style scope>
.message-alert {
  position: fixed;
  max-width: 50%;
  top: 56px;
  right: 20px;
  z-index: 1100;
}
.toast-body{
  color: #ffffff;

}
.toast-body .close {
  color: #ffffff;
  opacity: 1;
  line-height: 18px;
}
</style>
