import { debounce, observerDomResize } from '@/utils/index'

export default {
  data () {
    return {
      dom: '',

      width: 0,
      height: 0,

      debounceInitWHFun: '',

      domObserver: ''
    }
  },
  methods: {
    async autoResizeMixinInit () {

      await this.initWH(false)

      this.getDebounceInitWHFun()

      this.bindDomResizeCallback()

      if (typeof this.afterAutoResizeMixinInit === 'function') this.afterAutoResizeMixinInit()
    },
    initWH (resize = true) {
      return new Promise(resolve => {
        this.$nextTick(_ => {
          const dom = this.dom = this.$refs[this.ref]

          this.width = dom ? dom.clientWidth : 0
          this.height = dom ? dom.clientHeight : 0

          if (!dom) {
            console.warn('DataV: Failed to get dom node, component rendering may be abnormal!')
          } else if (!this.width || !this.height) {
            console.warn('DataV: Component width or height is 0px, rendering abnormality may occur!')
          }

          if (typeof this.onResize === 'function' && resize) this.onResize()

          resolve()
        })
      })
    },
    getDebounceInitWHFun () {
      this.debounceInitWHFun = debounce(100, this.initWH)
    },
    bindDomResizeCallback () {
      this.domObserver = observerDomResize(this.dom, this.debounceInitWHFun)

      window.addEventListener('resize', this.debounceInitWHFun)
    },
    unbindDomResizeCallback () {


      if (!this.domObserver) return

      this.domObserver.disconnect()
      this.domObserver.takeRecords()
      this.domObserver = null

      window.removeEventListener('resize', this.debounceInitWHFun)
    }
  },
  mounted () {

    this.autoResizeMixinInit()
  },
  beforeDestroy () {
    this.unbindDomResizeCallback()
  }
}