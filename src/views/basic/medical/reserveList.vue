<template>
  <div class="app-container">
    <div class="filter-container" >
      <div class="left-box">
        <el-input v-model="listQuery.name" placeholder="请输入内容" class="filter-item" />
        <el-button style="margin-left: 10px;" @click="getList" icon="el-icon-refresh" type="primary">查询</el-button>
      </div>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top: 10px;">
      <el-table-column  label="序号" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="老人" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>

      <el-table-column label="老人账号" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.userPhone }}
        </template>
      </el-table-column>

      <el-table-column label="医生" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.doctorName }}
        </template>
      </el-table-column>

      <el-table-column label="医生账号" width="150" align="center">
        <template slot-scope="scope">
            {{ scope.row.doctorPhone }}
        </template>
      </el-table-column>

      <el-table-column label="挂号预约时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.reserveTimeStr }}
        </template>
      </el-table-column>

      <el-table-column label="预约状态" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.state }}
        </template>
      </el-table-column>

      <el-table-column label="挂号预约说明" align="center">
        <template slot-scope="scope">
          <p class="content-overflow">
            {{ scope.row.instructions }}
          </p>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import Pagination from '@/components/Pagination'
  import service from '@/utils/request'

  export default {
    components: { Pagination },
    directives: { waves },

    mounted: function() {
      this.getList();
    },

    data() {
      return {
        // 查询条件
        listQuery: {
          name: undefined,
          offset: 0,
          page: 1,
          pageSize: 10
        },

        // 列表数据，总数，加载中
        list: null,
        total: 0,
        listLoading: false,
      }
    },
    methods: {
      getList() {
        this.listLoading = true

        // 设置偏移量
        this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.pageSize

        service.get("/manage/medical/reserveList", { params: this.listQuery }).then(resp => {
          console.log(resp);
          this.listLoading = false
          this.list = resp.data
          this.total = resp.count
        })
      },
    }
  }
</script>
