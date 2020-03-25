<template>
  <div>
    <a-modal :title="title" v-model="visible" @ok="handleOk">
      <p v-if="status === 3">{{message}}</p>

      <label for="" v-if="status !== 3">{{content_data.title}}
          <a-input style="width: 100px; margin-left:10px;" id="tagdata" v-model="content_data.content" />
      </label>
      
    </a-modal>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        visible: false,
        title: '标题',
        message: '确认更新 ?',
        status: 3,
        content_data: {
            title: '',
            content: '',
        }
      };
    },
    watch: {
        status(newvalue) {
            console.log(newvalue)
            if (newvalue == 1) {
                this.content_data.title = 'tag:';
                this.content_data.content = 'cn';
            } else if (newvalue == 2) {
                this.content_data.title = '备注:';
                this.content_data.content = '数值更新';
            }
        }
    },
    methods: {
      handleOk() {
        this.visible = false;

        this.$emit('setGitpar');
      },
    },
  };
</script>