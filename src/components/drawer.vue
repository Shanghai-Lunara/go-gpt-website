<template>
    <a-drawer
      title="文件"
      placement="bottom"
      :closable="false"
      @close="onClose"
      :visible="visible"
      :afterVisibleChange="afterVisibleChange"
    >
      <!-- <p v-for="value in list_data" :key="value" style="float: left; margin-left: 20px;">{{value}}读取</p> -->
      <a-button type="primary" v-for="value in list_data" :key="value" style="float: left; margin-left: 20px; margin-top: 10px;" @click="clickRead(value)">{{value}}读取</a-button>
    </a-drawer>
</template>
<script>
  export default {
    data() {
      return {
        visible: false,
        list_data: '',
      };
    },
    methods: {
      afterVisibleChange(val) {
        console.log('visible', val)
      },
      showDrawer() {
        this.visible = true;
      },
      onClose() {
        this.visible = false;
      },
      clickRead(data) {
          this.visible = false;
          this.$emit('setDrawer',data)
      },
    },
  };
</script>
