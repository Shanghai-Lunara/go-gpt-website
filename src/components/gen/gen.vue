<template>
    <div style="height: 100%;">
        <el-container style="height: 100%">
            <el-header>
                <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="分支选择">
                    <el-select v-model="value" @change="branchChange">
                        <el-option v-for="key in option" :key="key" :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">更表</el-button>
                </el-form-item>
                </el-form>
            </el-header>
            <el-main></el-main>
        </el-container>
    </div>
    
</template>

<script>
export default {
    data() {
      return {
        option: [],
        value: '',
      }
    },
    created: function() {
        this.$get('/git/all')
            .then((res) => {
              var all_data = res.data;
              this.option = [];
              
              for (var key in all_data) {
                  var list = all_data[key]['list_branches']
                  for (let index = 0; index < list.length; index++) {
                      this.option.push(list[index]['name'])
                      if (list[index]['active'] == 1) {
                        this.value = list[index]['name'];
                      }
                  }
              }
            })
    },
    methods: {
      onSubmit() {
        console.log(this.value);
        this.$confirm('确定要更表?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '更表成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      },
      branchChange(value) {
          this.value = value;
      }
    }
}
</script>

<style>
.el-header {
    padding: 0;
}

.el-main {
    padding: 0;
}
  
</style>