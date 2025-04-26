<template>
  <div>
    <AppNav/>
    <router-view></router-view>
    <footer class="container-fluid">
      <div class="row contactUs">
        <div class="contactTxt col-12 col-md-5">
          <div class="contactDetail ml-auto">
            <h2 class="title">Contact Us</h2>
            <div class="line"></div>
            <p class="mt-4">
              感謝您對 HomeTown 的支持與愛護，如有任何問題或商品合作洽談，
              歡迎提出意見及回饋，我們將用心聆聽，並以最快速度回應，為您提供更好的服務。
            </p>
          </div>

          <validation-observer v-slot="{ invalid }">
            <form id="contactForm" class="contactForm shadow p-3 p-md-5">
              <div class="form-group">
                <validation-provider v-slot="{ errors, classes }" rules="required">
                  <input
                    type="text"
                    class="form-control"
                    :class="classes"
                    name="姓名"
                    placeholder="Name 姓名"
                    v-model="form.name"
                  />
                  <span v-if="errors[0]" class="text-danger">{{ errors[0] }}</span>
                </validation-provider>
              </div>
              <div class="form-group">
                <validation-provider v-slot="{ errors, classes }" rules="required|email">
                  <input
                    type="email"
                    class="form-control"
                    :class="classes"
                    name="信箱"
                    placeholder="Email 信箱"
                    v-model="form.email"
                  />
                  <span v-if="errors[0]" class="text-danger">{{ errors[0] }}</span>
                </validation-provider>
              </div>
              <div class="form-group">
                <validation-provider v-slot="{ errors, classes }" rules="required">
                  <textarea
                    class="form-control"
                    :class="classes"
                    rows="3"
                    name="訊息"
                    placeholder="Message 訊息"
                    v-model="form.message"
                  >
                  </textarea>
                  <span v-if="errors[0]" class="text-danger">{{ errors[0] }}</span>
                </validation-provider>
              </div>
              <div class="form-group text-right mb-0">
                <button type="button" :disabled="invalid" @click="contactSubmit" class="btn btn-info mx-auto">送出</button>
              </div>
              <input type="reset" style="display:none;" />
            </form>
          </validation-observer>
        </div>
        <div
          class="contactImg d-none d-md-block col-md-7"
          :style="{backgroundImage: `url(${img.office})` }"
        ></div>
      </div>
      <div class="container underLine py-2 text-center">
        HomeTown Designed by Liz.Lin ⓒ 2020 All Right Reserved. ｜僅個人作品練習，無商業用途
        <router-link to="/login" class="mx-3">
          <i class="fas fa-user-cog"></i> <u>前往後台</u>
        </router-link>
      </div>
    </footer>
    <div id="contactModal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body text-center">
            <div class="h5 text-info font-weight-bold">感謝您的聯繫</div>
            <div class="h5 text-info font-weight-bold">我們將盡快與您聯絡！</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */

import AppNav from '@/components/Nav.vue'

export default {
  name: 'Layout',
  components: {
    AppNav
  },
  data () {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      },
      img: {
        office:
          'https://hexschool-api.s3.us-west-2.amazonaws.com/custom/ToGrp5oKeNiOvFn60NseexL3mdxLc6HTYC77Oqu6dAr4QXzwdOKXvDzW7biyZkTHAc4WT4ea0mI8ESiUPJbOfCm7HwQpc42bOhdKVw5ugihTgwef0jMH896ixy1S9l4U.jpg'
      }
    }
  },
  methods: {
    contactSubmit () {
      $('#contactModal').modal('show')
      setTimeout(() => {
        $('#contactModal').modal('hide')
      }, 5000)
    }
  }
}
</script>
