<template>
  <div>
    <div class="couponTitle">
      <h2 class="title text-center">anniversary sale</h2>
      <div class="line mx-auto"></div>
    </div>

    <div class="eggBox container mx-auto mt-5"
    :style="{backgroundImage: `url(${img.disBgL}), url(${img.disBgR})` }">
      <div class="primLine">
        <div class="couponTxt text-center mx-auto">
          <div class="h3 font-weight-bold">
            <i class="fas fa-glass-cheers mr-2"></i>
            <span>週年慶刮刮樂</span>
          </div>
          <div class="h5 mt-3">快來玩刮刮樂遊戲！刮開你個人的專屬優惠大獎，多項折扣等你來拿，不限金額每筆訂單最高享有"五折"大優惠，數量有限送完為止，早買早享受唷！</div>
        </div>
        <!-- 刮刮樂區塊 -->
        <div class="main mx-auto mt-4 mt-sm-5 text-center">
          <img class="award" :src="award_pic" alt="">
          <div class="mt-2">結帳時輸入以下序號，即可獲得折扣優惠</div>
          <div class="coupon mt-3 d-flex justify-content-center align-items-center">
            <input id="input_code" type="text" readonly v-model="discount_code"/>
            <div class="btn btn-outline-info"
              @click="clipboard()"
              ref="copy"
              data-clipboard-target="#input_code"
              >
              <i class="fas fa-copy"></i>
            </div>
          </div>
          <div class="mt-3">
            不甘心結果嗎<i class="fas fa-hand-point-right mx-2"></i>
            <div class="btn btn-outline-info btn-sm" @click="reload">再玩一次</div>
          </div>
          <canvas id="myCanvas" style="position: absolute;top:0; left: 0; z-index: 1000;"></canvas>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
/* global $ */

export default {
  name: 'payment',
  data () {
    return {
      award_pic: '',
      discount_code: '12345',
      copyBtn: null, // 儲存初始化複製按鈕事件
      img: {
        banner:
          'https://hexschool-api.s3.us-west-2.amazonaws.com/custom/HYMjBNd1w2pIbmbPkhzBETIPArFvCdK1hbyk8ug7kQOcTNQQ6Htwffj3G7alDUPIW7ZnJloorvHNYWIBrv1y27DwbZtUCbaQ7ozv3QeG8TEU2HRpbbxx6ZS68xNiU5VO.jpg',
        disBgL:
          require('@/assets/img/disBgL.png'),
        disBgR:
          require('@/assets/img/disBgR.png')
      }
    }
  },
  created () {},
  mounted () {
    this.scratchInit()
    this.copyBtn = new this.Clipboard(this.$refs.copy)
  },
  methods: {
    reload () {
      // this.$router.go(0)
      location.reload()
    },
    clipboard () {
      this.$bus.$emit('message:push', '已複製序號，快去購物吧！', 'success')
    },
    scratchInit () {
      const myCanvas = document.getElementById('myCanvas')
      const parentDOM = document.getElementById('myCanvas').parentNode
      const can = myCanvas.getContext('2d')
      const rect = myCanvas.getBoundingClientRect()

      myCanvas.width = parentDOM.clientWidth
      myCanvas.height = parentDOM.clientHeight

      // 获取当前画布的宽高
      const X = myCanvas.width
      const Y = myCanvas.height

      // 用填充顏色當圖片
      const myGradient = can.createLinearGradient(0, 0, X, Y)
      myGradient.addColorStop(0, '#E6E4E0')
      myGradient.addColorStop(1, '#CFCBC4')
      can.fillStyle = myGradient
      can.fillRect(0, 0, X, Y)

      const device = /android|iphone|ipad|ipod|webos|iemobile|opear mini|linux/i.test(navigator.userAgent.toLowerCase())
      const startEvtName = device ? 'touchstart' : 'mousedown'
      const moveEvtName = device ? 'touchmove' : 'mousemove'
      const endEvtName = device ? 'touchend' : 'mouseup'

      /* 增加触摸监听 */
      myCanvas.addEventListener(startEvtName, function () {
        myCanvas.addEventListener(moveEvtName, draw, false)
      }, false)

      myCanvas.addEventListener(endEvtName, function () {
        myCanvas.removeEventListener(moveEvtName, draw, false)
      }, false)

      /* 根据手指移动画线，使之变透明 */
      function draw (event) {
        event.preventDefault()
        const x = device ? event.touches[0].pageX - rect.x : event.offsetX
        const y = device ? event.touches[0].pageY - rect.y : event.offsetY

        can.beginPath()
        can.globalCompositeOperation = 'destination-out'
        can.arc(x, y, 20, 0, Math.PI * 2, false)
        can.fill()
        can.closePath()
      }

      // 扣除到一定程度,自己打开
      document.addEventListener(endEvtName, function () {
        /* 获取imageData对象 */
        const imageDate = can.getImageData(0, 0, myCanvas.width, myCanvas.height)

        // 所有像素點數
        const allPX = imageDate.width * imageDate.height

        // 刮开的像素点个数
        let iNum = 0

        for (let i = 0; i < allPX; i++) {
          if (imageDate.data[i * 4 + 3] === 0) {
            iNum++
          }
        }
        // 刮開多少比例，canvas消失
        if (iNum >= allPX * 3 / 10) {
          $('#myCanvas').fadeOut(500)
        }
      }, true)

      // 建立折扣
      const arr = ['9', '8', '5']

      function shuffle (arr) {
        for (let j, x, i = arr.length; i;) {
          j = Math.floor(Math.random() * i)
          x = arr[--i]
          arr[i] = arr[j]
          arr[j] = x
        }
        return arr
      };

      // 打亂陣列重新排列
      shuffle(arr)

      // 放入獎項文字
      switch (arr[2]) {
        case '9':
          this.award_pic = require('../../assets/img/dis9.png')
          break
        case '8':
          this.award_pic = require('../../assets/img/dis8.png')
          break
        case '5':
          this.award_pic = require('../../assets/img/dis5.png')
          break
      };

      // 判斷折價金額所顯示的序號
      switch (arr[2]) {
        case '9':
          this.discount_code = 'home90'
          break
        case '8':
          this.discount_code = 'home80'
          break
        case '5':
          this.discount_code = 'home50'
          break
      };
    }
  }
}
</script>
