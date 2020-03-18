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
            <a-menu-item v-for="item in item_data" :key="item.id">{{item.name}}</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 24px 24px 24px">
        <a-layout-content
          :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
        >
            <a-select v-model="defaultValue" style="width: 240px" @change="handleChange" id="select">
                <a-select-option v-for="branch in branch_data" :key="branch" v-bind:value="branch">{{branch}}</a-select-option>
            </a-select>
            <a-button type="primary" id="btn" @click="setGit()">更表</a-button>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
  import axios from 'axios'

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
      };
    },
    created: function () {
        axios.get('http://192.168.16.202:8088/git/all')
        .then(res => {
            var all_data = res.data.data;
            var index = 1;
            var now_data = {};
            for (var key in all_data) {
                now_data.id = index
                now_data.name = all_data[key]['name'] 
                this.project_data.push(now_data)
                index++
                var list = all_data[key]['list_branches']
                for (let index = 0; index < list.length; index++) {
                    this.branch_data.push(list[index]['name'])
                }
            }
            this.defaultValue = this.branch_data[0];
            this.branch = this.branch_data[0];
            this.project_name = 'hero';
        })
        .catch(err => {
            console.error(err); 
        })
    },
    methods: {
        handleChange(value) {
            this.branch = value;
        },
        setGit () {
            console.log(this.branch)
            var url = 'http://192.168.16.202:8088/git/gen/' + this.project_name + '/' + this.branch;
            axios.get(url)
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
      margin-left: 20px;
  }
</style>
