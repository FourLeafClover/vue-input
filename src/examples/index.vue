<template>
  <div class="examples">
    <div class="examples-pc">
      <h1>PC</h1>
      <v-input :options="options1" :enterSend="true"></v-input>
    </div>
    <div class="examples-mobile">
      <h1>Mobile</h1>
      <v-input :options="options2" :enterSend="false"></v-input>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      options1: {
        lineHeight: 16,
        rows: 3,
        maxRows: 0,
        padding: 0
      },
      options2: {
        lineHeight: 16,
        rows: 2,
        maxRows: 4,
        padding: 0
      }
    }
  }
}
</script>
<style lang="less" scoped>
.examples {
  .examples-pc {
    width: 100%;
    textarea {
      width: 100%;
    }
  }
  .examples-mobile {
    width: 100%;
    textarea {
      width: 100%;
    }
  }
}
</style>
