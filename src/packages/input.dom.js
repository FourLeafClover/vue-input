import { isIE } from './utils'

export class InputDom {
  $el = null; // 存储dom
  options = { maxRows: 0, rows: 0 };
  originalStyles = {};
  cacheDom = {
    scrollTop: 0,
    scrollHeight: 0
  }

  // px转number
  pxToNumber (px) {
    return Number(px.replace('px', ''))
  }

  constructor ($el, options) {
    this.$el = $el
    this.options = options
    const styles = window.getComputedStyle(this.$el)
    // 拷贝一份样式
    this.originalStyles = {
      height: this.pxToNumber(styles.height), // 高度
      width: this.pxToNumber(styles.width),
      lineHeight: this.pxToNumber(styles.lineHeight), // 字体高度
      extraHeight: this.pxToNumber(styles.paddingTop) +
        this.pxToNumber(styles.paddingBottom) +
        this.pxToNumber(styles.borderTopWidth) +
        this.pxToNumber(styles.borderBottomWidth)
    }
    this.cacheScrollHeight()
    window.$inputDom = this
  }

  /**
   * 获取光标位置
   *
   * @return {*}
   * @memberof InputDom
   */
  getCursorPosition () {
    var cursorPos = 0
    if (document.selection) {
      var selectRange = document.selection.createRange()
      selectRange.moveStart('character', -this.$el.value.length)
      cursorPos = selectRange.text.length
    } else if (this.$el.selectionStart || this.$el.selectionStart === 0) {
      // Firefox support
      cursorPos = this.$el.selectionStart
    }
    return cursorPos
  }

  /**
   * 设置光标位置
   *
   * @param {*} pos 位置
   * @memberof InputDom
   */
  setCursorPosition = (pos) => {
    if (this.$el.setSelectionRange) {
      this.$el.focus()
      this.$el.setSelectionRange(pos, pos)
    } else if (this.$el.createTextRange) {
      // Firefox support
      const range = this.$el.createTextRange()
      range.collapse(true)
      range.moveEnd('character', pos)
      range.moveStart('character', pos)
      range.select()
    }
  }

  /**
   * 添加光标最后
   *
   * @memberof InputDom
   */
  setCursorToEnd = () => {
    const pos = this.$el.value.length
    this.setCursorPosition(pos)
  }

  // 缓存滚动高度
  cacheScrollHeight () {
    this.cacheDom = {
      scrollHeight: this.$el.scrollHeight
    }
  }

  /**
   * 克隆输入框获取输入框本来的滚动高度
   *
   * @return {*}
   * @memberof InputDom
   */
  getInputTextHeight () {
    const isFocus = this.$el === document.activeElement
    const cloneEl = this.$el.cloneNode(true)
    cloneEl.value = this.$el.value
    cloneEl.style.height = '0px'
    cloneEl.style.width = `${this.originalStyles.width}px`
    document.body.appendChild(cloneEl)
    const realScrollHeight = cloneEl.scrollHeight
    // 重新聚焦是为了解决IOS下append cloneEl 导致键盘关闭的情况
    if (isFocus) {
      this.$el.focus()
    }
    document.body.removeChild(cloneEl)
    return realScrollHeight
  }

  resizeInput () {
    // eslint-disable-next-line no-debugger
    if (!isIE()) {
      setTimeout(() => {
        const height = this.$el.scrollHeight
        // 高度大于之前高度就重新设置输入框高度
        if (height > this.cacheDom.scrollHeight) {
          this.$el.scrollTop += this.options.lineHeight
          if (this.options.maxRows > 0) {
            if (height <= (this.originalStyles.lineHeight * this.options.maxRows + this.originalStyles.extraHeight)) {
              this.$el.style.height = height + 'px'
            }
          }
          this.cacheDom.scrollHeight = height
        } else {
          const realHeight = this.getInputTextHeight()
          if (height > realHeight && height > this.originalStyles.height) {
            this.$el.style.height = realHeight + 'px'
            this.cacheDom.scrollHeight = realHeight
          }
        }
      }, 0)
    }
  }
}
