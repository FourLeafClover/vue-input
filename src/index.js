// 引入组件
import vInput from './packages/index'

vInput.install = Vue => Vue.component(vInput.name, vInput)

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vInput)
}

export default vInput
