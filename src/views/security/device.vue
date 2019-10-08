<template>
  <div class="app-container">

    <div class="filter-container" >
      <div class="left-box">
        <el-input v-model="listQuery.name" placeholder="请输入查询内容" class="filter-item" />
        <el-select v-model="listQuery.state" style="width: 130px;margin: 0 10px;"  placeholder="设备类型">
          <el-option
            v-for="item in status_optins"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
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
     >

      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="绑定" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="账号" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备编号" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>

      <el-table-column label="激活时间" min-width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column label="设备类型" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
     </el-table>


  </div>
</template>

<script>

import service from '@/utils/request'
import waves from '@/directive/waves'
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
      listQuery: {
        name: undefined,
        state:undefined,
        offset : 0,
        page : 1,
        pageSize : 10
      },
      status_optins: [{id: 0, name: '手环'}, {id: 1, name: '腕表'}, ],

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true

      service.get("/manage/device/list",  {params: this.listQuery}).then(response => {
        this.list = response.data.items
        this.listLoading = false;
      })


    }
  }
}
</script>
