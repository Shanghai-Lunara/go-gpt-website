<template>
  <div class="edit_container" style="height: 700px;">
    <el-select  v-model="value" placeholder="请选择分支" style="width: 200px;" @change="getContent">
        <el-option
        v-for="(v, k) in list"
        :key="k"
        :value="k">
        </el-option>
    </el-select>
    <el-input v-model="input" placeholder="请输入标题" style="width: 500px;margin-left: 10px;"></el-input>
    <quill-editor 
        v-model="content"
        ref="myQuillEditor"
        :options="editorOption"
        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
        @change="onEditorChange($event)"
        >
    </quill-editor> 
    <el-button type="primary" plain v-on:click="saveHtml" style="margin-top: 5px;">保存</el-button>
  </div>
</template> 
<script>
export default {
    data(){
        return {
            content: '',
            input: '',
            name: '',
            list: '',
            value: '',
            branch: '',
            editorOption: {
                modules:{
                    toolbar:[
                    ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
                    ['blockquote', 'code-block'],  //引用，代码块


                    [{ 'header': 1 }, { 'header': 2 }],  // 标题，键值对的形式；1、2表示字体大小
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],  //列表
                    [{ 'script': 'sub'}, { 'script': 'super' }], // 上下标
                    [{ 'indent': '-1'}, { 'indent': '+1' }],  // 缩进
                    [{ 'direction': 'rtl' }],    // 文本方向  

                    [{ 'size': ['small', false, 'large', 'huge', '24px'] }], // 字体大小
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],  //几级标题


                    [{ 'color': [] }, { 'background': [] }],  // 字体颜色，字体背景颜色
                    [{ 'font': [] }],  //字体
                    [{ 'align': [] }], //对齐方式


                    ['clean'], //清除字体样式
                    ]
                },
                theme:'snow'
            }
        }
    },
    mounted: function() {
        this.$nextTick(() => {
                this.$get('/oss/envs/' + this.name).then((res) => {
                        this.list = res.data;
                        console.log(res)
                    })
            })
        
    },
    computed: {
        editor() {
            console.log(2222)
            return this.$refs.myQuillEditor.quill;
        },
    },
    methods: {
        onEditorReady() {// 准备编辑器
            // console.log(1111)
        },
        onEditorBlur(){// 失去焦点事件
            // console.log(22222)
        }, 
        onEditorFocus(){// 获得焦点事件
            // console.log(333333)
        }, 
        onEditorChange(){// 内容改变事件
            // console.log(44444)
        }, 
        saveHtml() {
            if (this.input == '') {
                this.$message.error('公告标题不能为空');
                return;
            }

            if (this.content == '') {
                this.$message.error('公告内容不能为空');
                return;
            }

            this.$post('/oss/update', {
            'projectName' : this.name,
            'env' : this.branch,
            'title' : this.input,
            'content' : this.content
          })
            .then((res) => {
                this.$message.success('生成公告成功');
                window.open(this.list[this.branch], '_blank');
                console.log(res)
            })
        },
        getContent(value) {
            this.branch = value;
            this.$get('/oss/content/' + this.name + '/' + value).then((res) => {
                    this.content = res.data.content;
                    this.input = res.data.title;
                    console.log(res)
                })
        }
    }
}
</script>   

<style>
    .quill-editor {
        margin-top: 5px;
    }

    .ql-container.ql-snow {
        height: 500px;
    }

    .ql-editor.ql-blank {
        height: 450px;
    }

    .ql-toolbar.ql-snow .ql-size.ql-picker .ql-picker-label::before,
    .ql-toolbar.ql-snow .ql-size.ql-picker .ql-picker-item::before {
        content: '14px';
    }

    .ql-toolbar.ql-snow .ql-size.ql-picker .ql-picker-label[data-value=small]::before,
    .ql-toolbar.ql-snow .ql-size.ql-picker .ql-picker-item[data-value=small]::before {
        content: '10px';
    }

    .ql-toolbar.ql-snow .ql-size.ql-picker .ql-picker-label[data-value=large]::before,
    .ql-toolbar.ql-snow .ql-size.ql-picker .ql-picker-item[data-value=large]::before {
        content: '18px';
    }

    .ql-toolbar.ql-snow .ql-size.ql-picker .ql-picker-label[data-value=huge]::before,
    .ql-toolbar.ql-snow .ql-size.ql-picker .ql-picker-item[data-value=huge]::before {
        content: '32px';
    }

    .ql-toolbar.ql-snow .ql-header.ql-picker.ql-expanded .ql-picker-label::before,
    .ql-toolbar.ql-snow .ql-header.ql-picker.ql-expanded .ql-picker-item::before {
        content: '文本';
    }

    .ql-toolbar.ql-snow .ql-header.ql-picker.ql-expanded .ql-picker-label[data-value="1"]::before,
    .ql-toolbar.ql-snow .ql-header.ql-picker.ql-expanded .ql-picker-item[data-value="1"]::before {
        content: '标题1';
    }

    .ql-toolbar.ql-snow .ql-header.ql-picker.ql-expanded .ql-picker-label[data-value="2"]::before,
    .ql-toolbar.ql-snow .ql-header.ql-picker.ql-expanded .ql-picker-item[data-value="2"]::before {
        content: '标题2';
    }

    .ql-toolbar.ql-snow .ql-header.ql-picker.ql-expanded .ql-picker-label[data-value="3"]::before,
    .ql-toolbar.ql-snow .ql-header.ql-picker.ql-expanded .ql-picker-item[data-value="3"]::before {
        content: '标题3';
    }

    .ql-toolbar.ql-snow .ql-header.ql-picker.ql-expanded .ql-picker-label[data-value="4"]::before,
    .ql-toolbar.ql-snow .ql-header.ql-picker.ql-expanded .ql-picker-item[data-value="4"]::before {
        content: '标题4';
    }

    .ql-toolbar.ql-snow .ql-header.ql-picker.ql-expanded .ql-picker-label[data-value="5"]::before,
    .ql-toolbar.ql-snow .ql-header.ql-picker.ql-expanded .ql-picker-item[data-value="5"]::before {
        content: '标题5';
    }

    .ql-toolbar.ql-snow .ql-header.ql-picker.ql-expanded .ql-picker-label[data-value="6"]::before,
    .ql-toolbar.ql-snow .ql-header.ql-picker.ql-expanded .ql-picker-item[data-value="6"]::before {
        content: '标题6';
    }

    .ql-toolbar.ql-snow .ql-font.ql-picker .ql-picker-label::before,
    .ql-toolbar.ql-snow .ql-font.ql-picker .ql-picker-item::before {
        content: '标准字体';
    }

    .ql-toolbar.ql-snow .ql-font.ql-picker .ql-picker-label[data-value=serif]::before,
    .ql-toolbar.ql-snow .ql-font.ql-picker .ql-picker-item[data-value=serif]::before {
        content: '衬线字体';
    }
    
    .ql-toolbar.ql-snow .ql-font.ql-picker .ql-picker-label[data-value=monospace]::before,
    .ql-toolbar.ql-snow .ql-font.ql-picker .ql-picker-item[data-value=monospace]::before {
        content: '等宽字体';
    }

</style>
