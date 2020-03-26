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
            <a-row style="height: 100%;">
              <a-col :span="8" style="overflow: auto; height: 100%; margin-top: 10px;">
                <a-timeline v-if="branch_status === 2">
                  <a-timeline-item v-for="(svn_value, svn_index) in svn_log" :key="svn_index">
                    <p v-for="(message,id) in svn_value['message']" :key="id">{{message}}</p>

                    <a-select defaultValue="file change" style="width: 500px">
                      <a-select-opt-group v-for="(select_value, select_id) in svn_value['select']" :key="select_id">
                        <span slot="label"><a-icon type="user" />{{select_id}}</span>

                        <!-- one -->
                        <!-- <a-select-option v-for="(select_value, select_id) in svn_value['select']" :key="select_id" v-bind:value="select_value">
                          {{select_value}}
                        </a-select-option> -->

                        <!-- two -->
                        <a-select-option v-for="k in select_value" :key="k" v-bind:value="k">
                          {{k}}
                        </a-select-option>
                      </a-select-opt-group>
                    </a-select>

                  </a-timeline-item>
                </a-timeline>

                <div v-if="branch_status === 3">
                  <div v-if="ftp_status == 2">
                     <a-textarea
                    v-model="fileContent"
                    placeholder="file content"
                    :autoSize="{ minRows: 3, maxRows: 5 }"
                    style="height: 600px;"
                    id="text_content"
                  />
                  <a-button type="primary" id="set" @click="setContent" style="margin-left: 180px; margin-top: 10px;">确认修改</a-button>
                  </div> 
                </div>
              </a-col>

              <a-col :span="8" style="margin-top:50px;">
                <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                  <a-form-item label="分支选择">
                    <a-select v-model="defaultValue" style="width: 240px; margin-left: 10px;" @change="handleChange" id="select">
                      <a-select-option v-for="branch in branch_data" :key="branch" v-bind:value="branch">{{branch}}</a-select-option>
                    </a-select>
                  </a-form-item>

                  <div>
                    <a-tabs defaultActiveKey="1" @change="callback" v-if="branch_status === 3">
                      <a-tab-pane tab="ftp文件生成" key="1">
                        <a-form-item label="ftp-type-flag">
                          <a-select defaultValue="pat" style="width: 240px; margin-left: 10px;" @change="typeChange">
                            <a-select-option v-for="type_value in zip_type" :key="type_value.id" v-bind:value="type_value.name">{{type_value.name}}</a-select-option>
                          </a-select>
                          <a-tree-select
                            style="width: 100%"
                            :treeData="treeData"
                            v-model="value"
                            treeCheckable
                            :showCheckedStrategy="SHOW_PARENT"
                            searchPlaceholder="Please select"
                          />
                        </a-form-item>
                        <a-button type="primary" id="create" @click="generate" style="margin-left: 180px;">生成</a-button>
                      </a-tab-pane>

                      <a-tab-pane tab="ftp日志文件查询" key="2" forceRender>
                        <a-input placeholder="Basic usage" defaultValue="intro" v-model="searchLog" />
                        <a-button type="primary" id="search" @click="search" style="margin-left: 180px; margin-top: 10px;">搜索日志</a-button>
                      </a-tab-pane>

                      <!-- <a-tab-pane tab="ftp文件读取" key="3">
                        <a-input-search
                          placeholder="文件名"
                          @search="onSearch"
                          enterButton="读取"
                          size="default"
                        />
                      </a-tab-pane> -->
                    </a-tabs>
                  </div>

                  <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                    <a-button type="primary" id="btn" @click="showModal(3)" v-if="branch_status === 1">
                      更表
                    </a-button>
                    <a-button type="primary" id="set" @click="showModal(1)" v-if="branch_status === 2">预览</a-button>
                    <a-button type="primary" id="commit" @click="showModal(2)" v-if="branch_status === 2">提交</a-button>
                  </a-form-item>
                </a-form>
              </a-col>

              <a-col :span="8" style="overflow: auto; height: 100%; margin-top: 10px;">
                <a-timeline>
                  <a-timeline-item v-for="(value,index) in task_data" :key="index" :color="value['status']">
                    <p v-for="message in value['task_data']" :key="message">{{message}}</p>
                  </a-timeline-item>
                </a-timeline>
              </a-col>
            </a-row>
            
        </a-layout-content>
      </a-layout>
    </a-layout>
    <popout ref="dialog" @setGitpar="setGit" />
    <drawer ref="shade" @setDrawer="onSearch" />
  </a-layout>
</template>
<script>
  import axios from 'axios';
  import popout from '../components/popout';
  import { TreeSelect } from 'ant-design-vue';

  import drawer from '../components/drawer';
  import qs from 'qs';

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
          { id: 3, name: 'ftp' }
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
        zip_type,
        value: ['8','9','11'],
        treeData,
        SHOW_PARENT,
        ziptype: 'pat',
        searchLog: 'intro',
        fileContent: '',
        ftp_status: 1,
        file_name: '',
      };
    },
    components: {
      popout,
      drawer,
    },
    created: function () {
        axios.get('http://192.168.16.202:8088/git/all')
        .then(res => {
            var all_data = res.data.data;
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
                    if (list[index]['active'] == 1) {
                      tag = list[index]['name'];
                    }
                }
            }
            this.defaultValue = tag;
            this.branch = tag;
            this.project_name = 'hero';
            setTimeout(this.pullTask, 1000);
        })
        .catch(err => {
            console.error(err); 
        })
    },
    mounted: function() {
      // setInterval(this.pullTask, 10000);
    },
    methods: {
        handleChange(value) {
            this.branch = value;
        },
        setGit() {
            if (this.$refs.dialog.status == 1) {
              this.setGenplist();
            } else if (this.$refs.dialog.status == 4) {
              this.gitSvgtag();
            } else if (this.$refs.dialog.status == 2) {
              this.commitSvn();
            }
        }, 
        setShade() {
          // 遮罩层
          this.$refs.shade.showDrawer;
        },
        showModal(id) {
          this.$refs.dialog.visible = true;
          this.$refs.dialog.title = this.branch;
          if (id === 1) {
            this.$refs.dialog.status = 1;
          } else if (id === 2){
            this.$refs.dialog.status = 2;
          } else {
            this.$refs.dialog.status = 3;
          }
        },
        setStatus(data) {
          this.branch_status = data;
          if (data == 3) {
            this.ftp_status = 1;
          }

          if (data == 2) {
            this.pullSvnlog();
            // this.time1 = setInterval(this.pullSvnlog, 1000);
          } else {
            clearInterval(this.time1);
          }
          
        },
        gitSvgtag() {
          var url = 'http://192.168.16.202:8088/git/set/' + this.project_name + '/' + this.branch + '/' + this.$refs.dialog.content_data.content;
          axios.get(url)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.error(err); 
          })
        },
        setGenplist() {
            var url = 'http://192.168.16.202:8088/git/gen/' + this.project_name + '/' + this.branch;
            axios.get(url)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.error(err); 
            })
        },
        commitSvn() {
          var url = 'http://192.168.16.202:8088/svn/commit/' + this.project_name + '/' + this.branch + '/' + this.$refs.dialog.content_data.content;
            axios.get(url)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.error(err); 
            })
        },
        pullSvnlog() {
          var url = 'http://192.168.16.202:8088/svn/log/' + this.project_name + '/3';
            axios.get(url)
            .then(res => {
                var result = res.data.data;
                this.svn_log = [];
            
                for (var index in result) {
                  var arr = [];
                  var list = [];
                  var select_data = {};

                  list.push(result[index]['revision']);
                  list.push(result[index]['msg']);
                  list.push(result[index]['author']);
                  list.push(result[index]['date_time']);
                 
                  var path_list = result[index]['paths'];
                  for (var i = 0; i < path_list.length; i++) {
                    var num = path_list[i]['value'].lastIndexOf('/');
                    var k = path_list[i]['value'].slice(0, num);
                  
                    // select_data.push(path_list[i]['value'])
                    if (select_data[k] != undefined) {
                        select_data[k].push(path_list[i]['value'].slice(num + 1));
                    } else {
                       select_data[k] = [];
                       select_data[k].push(path_list[i]['value'].slice(num + 1));
                    }
                  }
                                    
                  arr['message'] = list;
                  arr['select'] = select_data;

                  this.svn_log.push(arr);
                }
              })
            .catch(err => {
                console.error(err); 
            })
        },
        pullTask() {
          axios.get('http://192.168.16.202:8088/task/all/hero')
          .then(res => {
            var result = res.data.data;
            for (var key in result) {
              var arr = [];
              if (result[key]['status'] === 0) {
                arr['status'] = 'gray';
              } else if (result[key]['status'] === 1) {
                arr['status'] = 'green';
              } else if (result[key]['status'] === 2) {
                arr['status'] = 'blue';
              } else {
                arr['status'] = 'red';
              }
              
              var command = result[key]['command']['project_name'] + "/" + result[key]['command']['branch_name'] + "/" + 
                result[key]['command']['command'] + "/" + result[key]['command']['message'] + "/" + result[key]['command']['zip_type'] + "/" +
                result[key]['command']['zip_flags'];

              result[key]['message'].unshift(command);
              arr['task_data'] = result[key]['message'];
              this.task_data.unshift(arr);
            }
          })
          .catch(err => {
            console.error(err); 
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
          axios.get('http://192.168.16.202:8088/ftp/compress/' + this.project_name + "/" + this.branch + "/" + this.ziptype + "/" + str)
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            console.error(err); 
          })
        },
        search() {
          this.$refs.shade.showDrawer();
          axios.get('http://192.168.16.202:8088/ftp/log/' + this.project_name + '/' + this.searchLog)
          .then(res => {
            var list_data = res.data.data;
            var arr = [];

            for (let index = 0; index < list_data.length; index++) {
              arr.unshift(list_data[index]['name']);
            }

            this.$refs.shade.list_data = arr;
          })
          .catch(err => {
            console.error(err); 
          })
        },
        onSearch(value) {
          // 读取文件
          axios.get('http://192.168.16.202:8088/ftp/read/' + this.project_name + '/' + value)
          .then(res => {
            var result = res.data.data;
            this.fileContent = result;
            this.file_name = value;
          })
          .catch(err => {
            console.error(err); 
          })
        },
        setContent() {
         
          // var str = this.fileContent.replace(/\n|\r\n/g,"\\r\\n")
          // var now_str = str.replace(/\//g,"\\")
          // var now_str = string.replace(/\s+/g,"")
          // var url = encodeURI(now_str);
          // axios.get('http://192.168.16.202:8088/ftp/write/' + this.project_name + '/' + this.file_name + '/' + url)
          // .then(res => {
          //   console.log(res)
          // })
          // .catch(err => {
          //   console.error(err); 
          // })
          axios.post('http://192.168.16.202:8088/ftp/write',qs.stringify({
            'projectName' : this.project_name,
            'fileName' : this.file_name,
            'content' : this.fileContent
          }))
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            console.error(err); 
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
