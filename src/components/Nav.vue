<template>
  <nav id="nav" class="navbar navbar-expand shadow-sm fixed-top">
    <loading :active.sync="isLoading"></loading>
    <router-link to="/" class="navbar-brand py-0">
      <img class="logoImg" src="@/assets/img/logoTop.png" alt="logoTop" />
      <div class="logoTxt">HomeTown</div>
    </router-link>
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav objs mr-sm-auto ml-auto ml-sm-0">
        <li class="nav-item">
          <router-link to="/products" class="nav-link text-center">
            <i class="fas fa-couch mr-1"></i>
            <span class="d-block d-sm-inline">家具列表</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/coupon" class="nav-link text-center">
            <i class="fas fa-money-bill-wave mr-1"></i>
            <span class="d-block d-sm-inline">優惠活動</span>
          </router-link>
        </li>
      </ul>
      <ul class="navbar-nav">
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle text-center"
            href="#"
            id="navbarDropdown"
            :data-toggle="$route.path !== '/cart' ? 'dropdown' : ''"
          >
            <i class="fa fa-shopping-cart" :class="{ ml2: cart.length >= '1' }"></i>
            <span class="badge badge-pill badge-danger" v-if="cart.length">{{cart.length}}</span>
            <span class="d-block d-sm-none">購物車</span>
          </a>
          <div
            class="dropdown-menu dropdown-menu-right text-center"
            v-show="$route.path !== '/cart'"
          >
            <!-- 未購物 -->
            <div v-if="!cart.length ">
              <h5 class="itemTitle my-2">您尚未選擇商品</h5>
              <router-link to="/products" class>
                <button class="btn btn-info mt-1">
                  <i class="fas fa-couch"></i> 先去選購吧
                </button>
              </router-link>
            </div>
            <!-- 有商品 -->
            <div v-if="cart.length">
              <h5 class="itemTitle text-center my-2">已選擇商品</h5>
              <div class="cart-scroll">
                <table class="itemContent">
                  <tbody class="d-flex justify-content-start align-items-center flex-column">
                    <tr v-for="item in cart" :key="item.id">
                      <td class="itemPicture">
                        <img :src="item.product.imageUrl[0]" alt />
                      </td>
                      <td class="itemName">{{ item.product.title }}</td>
                      <td>x{{ item.quantity }}</td>
                      <td class="text-info">{{ item.product.price | currency }}</td>
                      <td class="trashIcon" @click="removeCartItem(item.product.id)">
                        <i class="far fa-trash-alt"></i>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="totalInfo">
                <p>
                  小計
                  <span class="text-info h4 ml-5">{{ cartTotal | currency }}</span>
                </p>
                <router-link to="/cart" class="payBtn">
                  <button class="btn btn-info">
                    <i class="fa fa-shopping-cart"></i> 結帳去
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNav',
  data () {
    return {
      isLoading: false,
      cart: {},
      cartTotal: 0
    }
  },
  created () {
    this.getCart()
    const vm = this
    vm.$bus.$on('add-cart', (item, quantity) => {
      vm.addToCart(item, quantity)
    })
    vm.$bus.$on('nav-getCart', () => {
      vm.getCart()
    })
  },
  methods: {
    getCart () {
      this.isLoading = true
      const url = `${process.env.VUE_APP_APIPATH}${process.env.VUE_APP_UUID}/ec/shopping`

      this.$http.get(url).then((response) => {
        this.cart = response.data.data
        // 購物車金額拉出來重新計算，不然刪除時會出錯造成累加
        this.updateTotal()
        this.isLoading = false
      })
    },
    updateTotal () {
      this.cartTotal = 0
      this.cart.forEach((item) => {
        this.cartTotal += item.product.price * item.quantity
      })
    },
    addToCart (item, quantity = 1) {
      const url = `${process.env.VUE_APP_APIPATH}${process.env.VUE_APP_UUID}/ec/shopping`

      const cart = {
        product: item.id,
        quantity
      }

      this.$http.post(url, cart).then((response) => {
        this.getCart()
        this.$bus.$emit('message:push', `"${response.data.data.product.title}" 已成功放入購物車！`, 'success')
      }).catch((error) => {
        this.$bus.$emit('message:push', `${error.response.data.errors[0]}可直接去結帳囉~`, 'info')
      })
    },
    removeCartItem (id) {
      this.isLoading = true
      const url = `${process.env.VUE_APP_APIPATH}${process.env.VUE_APP_UUID}/ec/shopping/${id}`

      this.$http.delete(url).then((response) => {
        this.$bus.$emit('message:push', `${response.data.message}`, 'success')
        this.isLoading = false
        this.getCart()
      })
    }
  },
  beforeUnmount: function () {
    // 元件銷毀前要註銷監聽事件
    this.$bus.$off('add-cart')
    this.$bus.$off('nav-getCart')
  }
}
</script>
