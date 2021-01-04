import Vue from 'vue'
import App from './examples/index.vue'
import vInput from './packages'

Vue.config.productionTip = false

Vue.component(vInput.name, vInput)

new Vue({
  render: h => h(App)
}).$mount('#app')
