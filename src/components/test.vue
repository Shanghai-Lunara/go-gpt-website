<template>
    <el-container style="height: 100%; border: 1px solid #eee">
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
            <el-menu :default-openeds="['1']">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-more"></i>
                        go-gpt-website
                    </template>
                    <el-menu-item-group v-for="menu_id in menu_data" :key="menu_id">
                        <template slot="title"><i class="el-icon-caret-right"></i>{{menu_id}}</template>
                            <el-menu-item index="1-1" style="padding-left: 70px">gen</el-menu-item>
                            <el-menu-item index="1-2" style="padding-left: 70px">svn</el-menu-item>
                            <el-menu-item index="1-3" style="padding-left: 70px">ftp</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-aside>
        
            <el-container>
                <el-header style="text-align: right; font-size: 12px">
                </el-header>
                
                <el-main>
                    <el-table :data="tableData">
                        <el-table-column prop="date" label="日期" width="140">
                        </el-table-column>
                        <el-table-column prop="name" label="姓名" width="120">
                        </el-table-column>
                        <el-table-column prop="address" label="地址">
                        </el-table-column>
                    </el-table>
                </el-main>
            </el-container>
        </el-container>
</template>

<style>

  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
</style>

<script>


  export default {
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        tableData: Array(20).fill(item),
        menu_data: [],
      }
    },
    created: function() {
        this.$get('/git/all')
            .then((res) => {
              var data = res.data;
              console.log(data)
              for (let key in data) {
                  console.log(key)
                  this.menu_data.push(data[key]['name'])
              }
            })
    },
  };
</script>