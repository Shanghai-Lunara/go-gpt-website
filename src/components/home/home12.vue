<template>
  <a-layout id="components-layout-demo-top-side-2">
    <a-layout-header class="header">
      <div class="logo"> go-gpt-web </div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
          mode="inline"
          :defaultSelectedKeys="[1]"
          :defaultOpenKeys="[1]"
          :style="{ height: '100%', borderRight: 0 }"
          id="menu"
        >
          <a-sub-menu 
          v-for="value in project_data"
          :key="value.id"
          >
            <span slot="title"><a-icon type="laptop" />{{value.name}}</span>
            <a-menu-item v-for="item in item_data" :key="item.id" @click="setStatus(item.id)">{{item.name}}</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 10px">
        <a-layout-content
          :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
        >
          <el-container style="height: 100%">
            <el-header>
                <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="分支选择">
                    <el-select v-model="value" @change="branchChange">
                        <el-option v-for="key in option" :key="key" :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="updateGen">更表</el-button>
                    <el-button type="primary" @click="taskList">任务列表</el-button>
                </el-form-item>
                </el-form>
            </el-header>
            <el-main></el-main>
          </el-container>
            
        </a-layout-content>
      </a-layout>
    </a-layout>
    <popout ref="dialog" @setGitpar="setGit" />
  </a-layout>
</template>
<script>
  // import { TreeSelect } from 'ant-design-vue';
  import popout from '../popout';

  export default {
    data() {
      return {
        
      };
    },
    components: {
      popout,
      // drawer,
    },
    created: function () {
      // 拉取分支
      this.$get('/git/all')
            .then((res) => {
              var all_data = res.data;
              var index = 1;
              var now_data = {};
              var tag = '';
              for (var key in all_data) {
                  now_data.id = index
                  now_data.name = all_data[key]['name'] 
                  this.project_data.push(now_data)
                  index++
                  var list = all_data[key]['list_branches']
                  for (let index = 0; index < list.length; index++) {
                      this.branch_data.push(list[index]['name'])
                      this.get_tag[list[index]['name']] = list[index]['svn_tag'];
                      if (list[index]['active'] == 1) {
                        tag = list[index]['name'];
                      }
                  }
              }
              this.defaultValue = tag;
              this.branch = tag;
              this.project_name = 'hero';
              this.pullTask();
            })
    },
    mounted: function() {
      setInterval(this.pullTask, this.Timer.task_refresh_time);
    },
    // methods: {
    //     handleChange(value) {
    //         this.branch = value;
    //     },
    //     setGit() {
    //         if (this.$refs.dialog.status == 3) {
    //           if (this.$refs.dialog.ftp_status == 1) {
    //             this.generate();
    //           } else {
    //             this.setGenplist();
    //           }
    //         } else if (this.$refs.dialog.status == 1) {
    //           this.gitSvgtag();
    //         } else if (this.$refs.dialog.status == 2) {
    //           this.commitSvn();
    //         }
    //     }, 
    //     showModal(id) {
    //       this.$refs.dialog.visible = true;
    //       this.$refs.dialog.title = this.branch;
    //       if (id === 1) {
    //         this.$refs.dialog.status = 1;
    //         this.$refs.dialog.ftp_status = 0;
    //         this.$refs.dialog.content_data.content = this.get_tag[this.branch];
    //       } else if (id === 2){
    //         this.$refs.dialog.status = 2;
    //         this.$refs.dialog.ftp_status = 0;
    //       } else if (id == 3) {
    //         this.$refs.dialog.status = 3;
    //         this.$refs.dialog.ftp_status = 0;
    //         this.$refs.dialog.message = '确认更新 ?';
    //       } else {
    //         this.$refs.dialog.status = 3;
    //         this.$refs.dialog.ftp_status = 1;
    //         this.$refs.dialog.message = '确认生成ftp?';
    //       }
    //     },
    //     setStatus(data) {

    //       this.branch_status = data;
    //       if (data == 3) {
    //         this.ftp_status = 1;
    //       }

    //       if (data == 2) {
    //         this.pullSvnlog();
    //         this.time1 = setInterval(this.pullSvnlog, this.Timer.svn_log_refresh);
    //       } else {
    //         clearInterval(this.time1);
    //       }
          
    //     },
    //     gitSvgtag() {
    //       // 指向svn生成
    //       if (this.$refs.dialog.content_data.content == '') {
    //         this.$message.info('信息不能为空');
    //         return;
    //       }
    //       this.$get('/git/set/' + this.project_name + '/' + this.branch + '/' + this.$refs.dialog.content_data.content)
    //       .then((res) => {
    //         this.$message.info('初始化tag成功');
    //         console.log(res)
    //       })
    //     },
    //     setGenplist() {
    //         // genlist
    //         this.$get('/git/gen/' + this.project_name + '/' + this.branch)
    //         .then((res) => {
    //           this.$message.info('更表成功');
    //           console.log(res)
    //         })
    //     },
    //     commitSvn() {
    //       // 提交svn
    //       if (this.$refs.dialog.content_data.content == '') {
    //         this.$message.info('备注信息不能为空');
    //         return;
    //       } 
    //       this.$get('/svn/commit/' + this.project_name + '/' + this.branch + '/' + this.$refs.dialog.content_data.content)
    //         .then((res) => {
    //           this.$message.info('svn提交成功');
    //           this.pullSvnlog();
    //           console.log(res)
    //         })
    //     },
    //     pullSvnlog() {
    //       // 拉取svn 日志
    //       this.$get('/svn/log/' + this.project_name + '/10')
    //         .then((res) => {
    //           var result = res.data;
    //             this.svn_log = [];
            
    //             for (var index in result) {
    //               var arr = [];
    //               var list = [];
    //               var select_data = {};

    //               list.push(result[index]['revision']);
    //               list.push(result[index]['msg']);
    //               list.push(result[index]['author']);
                  
    //               // list.push(result[index]['date_time']);
    //               list.push(this.Timer.setTime(result[index]['date_time']));
                 
    //               var path_list = result[index]['paths'];
    //               for (var i = 0; i < path_list.length; i++) {
    //                 var num = path_list[i]['value'].lastIndexOf('/');
    //                 var k = path_list[i]['value'].slice(0, num);
    //                 if (select_data[k] != undefined) {
    //                     select_data[k].push('[' + path_list[i]['action'] + ']' + path_list[i]['value'].slice(num + 1));
    //                 } else {
    //                    select_data[k] = [];
    //                    select_data[k].push('[' + path_list[i]['action'] + ']' + path_list[i]['value'].slice(num + 1));
    //                 }
    //               }
                                    
    //               arr['message'] = list;
    //               arr['select'] = select_data;

    //               this.svn_log.push(arr);
    //             }
    //         })
    //     },
    //     pullTask() {
    //       //  拉取所有任务
    //       this.$get('/task/all/hero')
    //       .then((res) => {
    //         this.task_data = [];
    //         var result = res.data;
    //         for (var key in result) {
    //           var arr = [];
    //           if (result[key]['status'] === 0) {
    //             arr['status'] = 'gray';
    //           } else if (result[key]['status'] === 1) {
    //             arr['status'] = 'green';
    //           } else if (result[key]['status'] === 2) {
    //             arr['status'] = 'blue';
    //           } else {
    //             arr['status'] = 'red';
    //           }
              
    //           var command = result[key]['command']['project_name'] + "/" + result[key]['command']['branch_name'] + "/" + 
    //             result[key]['command']['command'] + "/" + result[key]['command']['message'] + "/" + result[key]['command']['zip_type'] + "/" +
    //             result[key]['command']['zip_flags'];

    //           result[key]['message'].unshift(command);
    //           arr['task_data'] = result[key]['message'];
    //           this.task_data.unshift(arr);
    //         }
    //       })
    //     },
    //     typeChange(value) {
    //       this.ziptype = value;
    //     },
    //     callback(key) {
    //       this.ftp_status = key;
    //     },
    //     generate() {
    //       var arr = [];
    //       for (let index = 0; index < this.value.length; index++) {
    //         arr.push(this.treeData[this.value[index]]['title'])
    //       }
    //       var str = arr.join(',');

    //       this.$get('/ftp/compress/' + this.project_name + "/" + this.branch + "/" + this.ziptype + "/" + str)
    //         .then((res) => {
    //           this.$message.info('文件生成成功');
    //           console.log(res)
    //         })
    //     },
    //     search() {
    //       // 拉取ftp 日志
    //       if (this.searchLog == '') {
    //         this.$message.info('文件名不能为空');
    //         return;
    //       }

    //       this.$get('/ftp/log/' + this.project_name + '/' + this.searchLog)
    //         .then((res) => {
    //           var list_data = res.data;
    //           var arr = [];

    //           for (let index = 0; index < list_data.length; index++) {
    //             var str = list_data[index]['name'];
    //             if (str.search(/_222_/) > 0) {
    //               continue;
    //             }
    //             arr.unshift(list_data[index]['name']);
    //           }

    //           this.file_list = arr.slice(0,10);
    //         })
    //     },
    //     onSearch(value) {
    //       // 读取文件
    //       this.$get('/ftp/read/' + this.project_name + '/' + value)
    //         .then((res) => {
    //           var result = res.data;
    //           this.fileContent = result;
    //           this.file_name = value;
    //         })
    //     },
    //     setContent() {
    //       // file set & commit
    //       this.$post('/ftp/write', {
    //         'projectName' : this.project_name,
    //         'fileName' : this.file_name,
    //         'content' : this.fileContent
    //       })
    //         .then((res) => {
    //           this.fileContent = '';
    //           this.$message.info('文件更新成功');
    //           console.log(res)
    //         })
    //     },
    },
  };
</script>

<style>
  #components-layout-demo-top-side-2 .logo {
    width: 120px;
    height: 31px;
    margin: 16px 28px 16px 0;
    float: left;
    color: aliceblue;
    line-height: 31px;
    text-align: center;
  }

  .ant-layout {
      height: 100%;
  }

  #btn {
      margin-left: 10px;
  }

  #set {
      margin-left: 10px;
  }

  #commit {
      margin-left: 10px;
  }

  #pull {
      margin-left: 10px;
  }
</style>
