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
      <a-layout style="padding: 24px 24px 24px">
        <a-layout-content
          :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
        >
            <div style="height: 600px;" v-if="branch_status === 4">
              <editor ref="notice"></editor>
            </div>
            <a-row style="height: 100%;" v-if="branch_status !== 4">
              <a-col :span="8" style="overflow: auto; height: 100%; margin-top: 10px;">

                <el-timeline v-if="branch_status === 2">
                    <el-timeline-item placement="bottom" v-for="(svn_value, svn_index) in svn_log" :key="svn_index" :timestamp="svn_value['date_time']" type="primary">
                        <el-card style="margin-top: 10px;">
                            <h4>svn&nbsp;&nbsp;{{svn_value['revision']}}</h4>
                            <p>{{svn_value['msg']}}</p>

                            <el-collapse>
                                <el-collapse-item v-for="(select_value, select_id) in svn_value['paths']" :key="select_id" :title="select_id">
                                    <div v-for="(v,k) in select_value" :key="k">
                                        <label style="color: blue;">{{v}}</label>{{k}}
                                    </div>
                                </el-collapse-item>
                            </el-collapse>

                        </el-card>
                    </el-timeline-item>
                </el-timeline>

                <div v-if="branch_status === 3">
                  <div v-if="ftp_status == 2">
                     <a-textarea
                    v-model="fileContent"
                    placeholder="file content"
                    :autoSize="{ minRows: 4, maxRows: 30 }"
                    style="height: 800px; overflow: auto;"
                    id="text_content"
                  />
                  <a-button type="primary" id="set" @click="setContent" style="margin-left: 180px; margin-top: 10px;">确认修改</a-button>
                  </div> 
                </div>
              </a-col>

              <a-col :span="8" style="margin-top:50px; overflow: auto; height: 100%;" >
                <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                  <a-form-item label="分支选择">
                    <el-select v-model="defaultValue" style="width: 240px; margin-left: 10px;" @change="handleChange" id="select">
                      <el-option
                        v-for="branch in branch_data"
                        :key="branch"
                        :value="branch">
                      </el-option>
                    </el-select>
                  </a-form-item>

                  <div>
                    <a-tabs defaultActiveKey="1" @change="callback" v-if="branch_status === 3">
                      <a-tab-pane tab="ftp文件生成" key="1">
                        <a-form-item label="ftp-type-flag">
                          <a-select defaultValue="pat" style="width: 240px; margin-left: 10px;" @change="typeChange">
                            <a-select-option v-for="type_value in zip_type" :key="type_value.id" v-bind:value="type_value.name">{{type_value.name}}</a-select-option>
                          </a-select>
                          <a-tree-select
                            style="width: 100%;"
                            :treeData="treeData"
                            v-model="value"
                            treeCheckable
                            :showCheckedStrategy="SHOW_PARENT"
                            searchPlaceholder="Please select"
                          />
                        </a-form-item>
                        <a-button type="primary" id="create" style="margin-left: 180px;" @click="showModal(4)" >生成</a-button>
                      </a-tab-pane>

                      <a-tab-pane tab="ftp日志文件查询" key="2" forceRender>
                        <a-input placeholder="file name" defaultValue="intro" v-model="searchLog" />
                        <a-button type="primary" id="search" @click="search" style="margin-left: 180px; margin-top: 10px;">搜索日志</a-button>

                        <div style="margin-top: 20px;">
                          <a-button type="primary" v-for="file_value in file_list" :key="file_value" style="margin-top: 10px; margin-left: 20px;" @click="onSearch(file_value)">{{file_value}}</a-button>
                        </div>
                      
                        
                      </a-tab-pane>

                    </a-tabs>
                  </div>

                  <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                    <el-button type="primary" id="btn" @click="showModal(3)" v-if="branch_status === 1" size="medium">更表</el-button>
                    <el-button type="primary" id="btn" @click="showModal(1)" v-if="branch_status === 2" size="medium">预览</el-button>
                    <el-button type="primary" id="btn" @click="showModal(2)" v-if="branch_status === 2" size="medium">提交</el-button>
                  </a-form-item>
                </a-form>
              </a-col>

              <a-col :span="8" style="overflow: auto; height: 100%; margin-top: 10px;">
                
                <el-timeline>
                    <el-timeline-item placement="top" v-for="(value,index) in task_data" :key="index" :timestamp="value['command']" :type="value['status']">
                        <el-card style="margin-top: 10px;">
                            <el-timeline-item v-for="(status, time) in value['task_data']" :key="time" :timestamp="time" type="success">
                                {{status}}
                            </el-timeline-item>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
              </a-col>
            </a-row>
            
        </a-layout-content>
      </a-layout>
    </a-layout>
    <popout ref="dialog" @setGitpar="setGit" />
  </a-layout>
</template>
<script>
  import popout from '../popout';
  import { TreeSelect } from 'ant-design-vue';
  import editor from '../editor/editor';

  const SHOW_PARENT = TreeSelect.SHOW_PARENT;

  const treeData = [
    {
      title: 'api',
      value: '0',
      key: '0',
    },
    {
      title: 'push',
      value: '1',
      key: '1',
    },
    {
      title: 'campaign',
      value: '2',
      key: '2',
    },
    {
      title: 'guildwar',
      value: '3',
      key: '3',
    },
    {
      title: 'extensions',
      value: '4',
      key: '4',
    },
    {
      title: 'check',
      value: '5',
      key: '5',
    },
    {
      title: 'conf',
      value: '6',
      key: '6',
    },
    {
      title: 'game',
      value: '7',
      key: '7',
    },
    {
      title: 'gmt',
      value: '8',
      key: '8',
    },
    {
      title: 'public',
      value: '9',
      key: '9',
    },
    {
      title: 'long_connection',
      value: '10',
      key: '10',
    },
    {
      title: 'tools',
      value: '11',
      key: '11',
    },
    {
      title: 'version',
      value: '12',
      key: '12',
    },
  ];

  const zip_type = [
          { id: 1, name: 'ser' },
          { id: 2, name: 'pat' },
        ];

  export default {
    data() {
      return {
        project_data : [],
        item_data: [
          { id: 1, name: 'gen_plist' },
          { id: 2, name: 'svn' },
          { id: 3, name: 'ftp' },
          { id: 4, name: 'notice editor'}
        ],
        collapsed: false,
        branch_data: [],
        defaultValue: '',
        branch: '',
        project_name: '',
        branch_status: 1,
        num: 5,
        formLayout: 'horizontal',
        form: this.$form.createForm(this, { name: 'coordinated' }),
        task_data: [],
        svn_log: [],
        time1: '',
        time2: '',
        zip_type,
        value: ['8','9','11'],
        treeData,
        SHOW_PARENT,
        ziptype: 'pat',
        searchLog: 'intro',
        fileContent: '',
        ftp_status: 1,
        file_name: '',
        file_list: [],
        get_tag: [],
        count: 0,
      };
    },
    components: {
      popout,
      editor,
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
      this.time2 = setInterval(this.pullTask, this.Timer.task_refresh_time);
    },
    methods: {
        handleChange(value) {
            this.branch = value;
        },
        setGit() {
            if (this.$refs.dialog.status == 3) {
              if (this.$refs.dialog.ftp_status == 1) {
                this.generate();
              } else {
                this.setGenplist();
              }
            } else if (this.$refs.dialog.status == 1) {
              this.gitSvgtag();
            } else if (this.$refs.dialog.status == 2) {
              this.commitSvn();
            }
        }, 
        showModal(id) {
          this.$refs.dialog.visible = true;
          this.$refs.dialog.title = this.branch;
          switch (id) {
              case 1:
                    this.$refs.dialog.status = 1;
                    this.$refs.dialog.ftp_status = 0;
                    this.$refs.dialog.content_data.content = this.get_tag[this.branch];
                    break;
              case 2:
                    this.$refs.dialog.status = 2;
                    this.$refs.dialog.ftp_status = 0;
                    break;
              case 3:
                    this.$refs.dialog.status = 3;
                    this.$refs.dialog.ftp_status = 0;
                    this.$refs.dialog.message = '确认更新 ?';
                    break;
          
              default:
                    this.$refs.dialog.status = 3;
                    this.$refs.dialog.ftp_status = 1;
                    this.$refs.dialog.message = '确认生成ftp?';
                    break;
          }
        },
        setStatus(data) {
          this.branch_status = data;
          if (data == 3) {
            this.ftp_status = 1;
          }

          if (data == 2) {
            this.pullSvnlog();
            this.time1 = setInterval(this.pullSvnlog, this.Timer.svn_log_refresh);
          } else {
            clearInterval(this.time1);
          }

          if (data == 4) {
            clearInterval(this.time1);
            clearInterval(this.time2);
            this.$nextTick(() => {
              this.$refs.notice.name = this.project_name;
            })
          }
          
        },
        gitSvgtag() {
          // 指向svn生成
          if (this.$refs.dialog.content_data.content == '') {
            this.$message.error('信息不能为空');
            return;
          }
          this.$get('/git/set/' + this.project_name + '/' + this.branch + '/' + this.$refs.dialog.content_data.content)
          .then((res) => {
            this.$message.success('初始化tag成功');
            console.log(res)
          })
        },
        setGenplist() {
            // genlist
            this.$get('/git/gen/' + this.project_name + '/' + this.branch)
            .then((res) => {
              this.$message.success('更表成功');
              this.pullTask();
              console.log(res)
            })
        },
        commitSvn() {
          // 提交svn
          if (this.$refs.dialog.content_data.content == '') {
            this.$message.error('备注信息不能为空');
            return;
          } 
          this.$get('/svn/commit/' + this.project_name + '/' + this.branch + '/' + this.$refs.dialog.content_data.content)
            .then((res) => {
              this.pullSvnlog();
              this.$message.success('svn提交成功');
              console.log(res)
            })
        },
        pullSvnlog() {
          // 拉取svn 日志
          this.$get('/svn/log/' + this.project_name + '/10')
            .then((res) => {
              var result = res.data;
                this.svn_log = [];

                for (var index in result) {
                    
                    var select_data = {};
                    result[index]['date_time'] = this.Timer.setTime(result[index]['date_time'])

                    var path_list = result[index]['paths'];
                    for (var i = 0; i < path_list.length; i++) {
                        var num = path_list[i]['value'].lastIndexOf('/');
                        var k = path_list[i]['value'].slice(0, num);
                        if (select_data[k] != undefined) {
                            select_data[k][path_list[i]['value'].slice(num + 1)] = '[' + path_list[i]['action'] + ']';
                        } else {
                            select_data[k] = {};
                            select_data[k][path_list[i]['value'].slice(num + 1)] = '[' + path_list[i]['action'] + ']';
                        }
                    }

                    result[index]['paths'] = select_data;
                }

                this.svn_log = result;
            })
        },
        pullTask() {
          //  拉取所有任务
          this.$get('/task/all/hero')
          .then((res) => {
            this.task_data = [];
            var result = res.data;
            for (var key in result) {
              var arr = [];

              switch (result[key]['status']) {
                  case 0:
                      arr['status'] = 'info';
                      break;
                  case 1:
                      arr['status'] = 'success';
                      break;
                  case 2:
                      arr['status'] = 'primary';
                      break;
                  default:
                      arr['status'] = 'danger';
                      break;
              }
              
              var command = result[key]['command']['project_name'] + "/" + result[key]['command']['branch_name'] + "/" + 
                result[key]['command']['command'] + "/" + result[key]['command']['message'] + "/" + result[key]['command']['zip_type'] + "/" +
                result[key]['command']['zip_flags'];

            //   arr['task_data'] = result[key]['message'];
            //   console.log(result[key]['message'])
              var message = result[key]['message'];
              var list = {};
              for (var index = 0; index < message.length; index++) {
                  var num = message[index].lastIndexOf(']');
                  var time = message[index].slice(0, num + 1);
                  list[time] = message[index].slice(num + 2)
              }
            //   console.log(list)
              arr['task_data'] = list
              arr['command'] = command;
              this.task_data.unshift(arr);
            }

            var now_count = this.task_data.length;

            if (this.count != 0 && now_count != this.count) {
                this.$notify({
                    title: '任务列表变更',
                    message: '',
                    showClose: false,
                    type: 'warning'
                });
            }

            this.count = now_count;
          })
        },
        typeChange(value) {
          this.ziptype = value;
        },
        callback(key) {
          this.ftp_status = key;
        },
        generate() {
          var arr = [];
          for (let index = 0; index < this.value.length; index++) {
            arr.push(this.treeData[this.value[index]]['title'])
          }
          var str = arr.join(',');

          this.$get('/ftp/compress/' + this.project_name + "/" + this.branch + "/" + this.ziptype + "/" + str)
            .then((res) => {
              this.$message.success('文件生成成功');
              console.log(res)
            })
        },
        search() {
          // 拉取ftp 日志
          if (this.searchLog == '') {
            this.$message.error('文件名不能为空');
            return;
          }

          this.$get('/ftp/log/' + this.project_name + '/' + this.searchLog)
            .then((res) => {
              var list_data = res.data;
              var arr = [];

              for (let index = 0; index < list_data.length; index++) {
                var str = list_data[index]['name'];
                if (str.search(/_222_/) > 0) {
                  continue;
                }
                arr.unshift(list_data[index]['name']);
              }

              this.file_list = arr.slice(0,10);
            })
        },
        onSearch(value) {
          // 读取文件
          this.$get('/ftp/read/' + this.project_name + '/' + value)
            .then((res) => {
              var result = res.data;
              this.fileContent = result;
              this.file_name = value;
            })
        },
        setContent() {
          // file set & commit
          this.$post('/ftp/write', {
            'projectName' : this.project_name,
            'fileName' : this.file_name,
            'content' : this.fileContent
          })
            .then((res) => {
              this.fileContent = '';
              this.$message.success('文件更新成功');
              console.log(res)
            })
        },
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
