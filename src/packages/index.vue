<template>
  <textarea
    class="common-input"
    v-model="innerValue"
    @keydown="onKeydown"
    @mousedown="onMouseDown"
    :maxlength="maxlength"
    :readonly="readonly"
    :disabled="disabled"
    :placeholder="placeholder"
    :rows="options.rows"
    @paste="(e) => $emit('paste', e)"
  />
</template>
<script>
import { InputDom } from './input.dom'
const isMobile = () => {
  return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
}
export default {
  name: 'v-input',
  props: {
    value: {
      type: String,
      default: ''
    },
    enterSend: {
      // 只对PC端生效
      type: Boolean,
      default: true
    },
    autofocus: {
      type: Boolean,
      default: true
    },
    maxlength: {
      type: Number,
      default: 2000
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => {
        return {
          rows: 0,
          maxRows: 0
        }
      }
    }
  },
  data () {
    return {
      cursorIndex: 0,
      innerValue: '',
      inputUtils: null
    }
  },
  mounted () {
    this.inputUtils = new InputDom(this.$el, this.options)
    if (this.autofocus) {
      this.$el.focus()
    }
  },
  methods: {
    // 插入元素
    insertValue (value) {
      const preValue = this.innerValue.substring(0, this.cursorIndex)
      this.innerValue = this.innerValue.replace(
        preValue,
        `${preValue}${value}`
      )
      this.cursorIndex += value.length
      if (!isMobile()) {
        this.$nextTick(() => {
          this.inputUtils.setCursorPosition(this.cursorIndex)
        })
      }
    },
    // 添加元素
    appendValue (value) {
      this.inputUtils.cacheScrollHeight()
      this.innerValue += value
      this.cursorIndex = this.innerValue.length
      if (!isMobile()) {
        this.$nextTick(() => {
          this.inputUtils.setCursorToEnd()
        })
      }
    },
    onKeydown (e) {
      if (!isMobile()) {
        if (this.enterSend) {
          if (e.keyCode === 13) {
            if (e.shiftKey) {
              return true
            } else if (e.ctrlKey) {
            } else {
              e.preventDefault()
              this.$emit('on-enter')
            }
          }
        }
      }
      this.getCursorPosition()
    },
    onMouseDown () {
      this.getCursorPosition()
    },
    getCursorPosition () {
      setTimeout(() => {
        this.cursorIndex = this.inputUtils.getCursorPosition()
      }, 0)
    }
  },
  watch: {
    innerValue () {
      this.$emit('input', this.innerValue)
      this.inputUtils.resizeInput()
    },
    value () {
      if (this.value !== this.innerValue) {
        this.innerValue = this.value
      }
    }
  }
}
</script>
<style lang="less" scoped>
.common-input {
  font-size: 14px;
  word-break: break-all;
  overflow-x: hidden;
  line-height: 16px;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid black;
}
</style>
