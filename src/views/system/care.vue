<template>
  <div class="app-container">
    <div class="filter-container" >
      <div class="left-box">
        <el-input v-model="listQuery.name" placeholder="请输入查询内容" class="filter-item" />
        <el-button style="margin-left: 10px;" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
      </div>
      <el-button  class="filter-item" type="primary" icon="el-icon-edit">添加订单</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="margin-top: 10px;">
      >

      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="关怀标题" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>

      <el-table-column label="关怀内容" min-width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)" />
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  // import { getList } from '@/api/table'
  import waves from '@/directive/waves'
  import service from '@/utils/request'

  export default {
    directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        list: null,
        listLoading: true,
        // 查询条件
        listQuery: {
          name: undefined,
          state:undefined,
          offset : 0,
          page : 1,
          pageSize : 10
        },
        status_optins: [{id: 0, name: '无接单'}, {id: 1, name: '进行中'}, {id: 2, name: '已完成'}, {id: 3, name: '已取消'}],

      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        service.get("/manage/care/list",  {params: this.listQuery}).then(response => {
          this.list = response.data.items
          this.listLoading = false;
        })
      },
      // 更新
      handleUpdate(row) {

      },

      handleDelete(){
      }
    }
  }
</script>
