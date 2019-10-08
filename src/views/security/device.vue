<template>
  <div class="app-container">

    <div class="filter-container" >
      <div class="left-box">
        <el-input v-model="listQuery.title" placeholder="请输入设备ID" class="filter-item" />
        <el-select v-model="listQuery.type" style="width: 130px;margin: 0 10px;"  placeholder="设备类型">
          <el-option
            v-for="item in type_options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      </div>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top: 10px;">
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="绑定人" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>

      <el-table-column label="账号" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userPhone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="设备编号" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.deviceId }}
        </template>
      </el-table-column>

      <el-table-column label="激活时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTimeStr }}
        </template>
      </el-table-column>

      <el-table-column label="设备类型" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.type | typeFilter(scope.row.type)}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import Pagination from '@/components/Pagination'
  import service from '@/utils/request'

  export default {
    components: { Pagination },
    directives: { waves },
    filters: {
      typeFilter(type) {
        const type_map ={
          0: '手环',
          1: '腕表',
        }
        return type_map[type]
      }
    },
    data() {
      return {
        listQuery: {
          deviceId: undefined,
          type: undefined,
          offset : 0,
          page : 1,
          pageSize : 10
        },

        // 列表数据，总数，加载中
        list: null,
        total: 0,
        listLoading: false,

        type_options: [{id: undefined, name: undefined}, {id: 0, name: '手环'}, {id: 1, name: '腕表'}, ],
      }
    },
    created() {
      this.getList()
    },
    methods: {

      getList() {
        this.listLoading = true

        // 设置偏移量
        this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.pageSize

        service.get("/manage/device/list", {params: this.listQuery}).then(resp => {
          console.log(resp);
          this.listLoading = false
          this.list = resp.data
          this.total = resp.count
        })
      },
    }
  }
</script>
