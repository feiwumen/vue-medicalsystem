<template>
  <div class="app-container">
    <div class="filter-container" >
      <div class="left-box">
        <el-input v-model="listQuery.name" placeholder="机构名称" class="filter-item" />
        <v-distpicker style="margin-left: 10px;" :hide-area="true" @province="onChangeProvince" @city="onChangeCity"></v-distpicker>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      </div>
      <el-button  class="filter-item" type="primary" icon="el-icon-edit" @click="addDialogVisible = true">添加机构</el-button>
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

      <el-table-column label="机构名称" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="机构类型" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column label="机构地址"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column label="省" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>

      <el-table-column label="市" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.city}}</span>
        </template>
      </el-table-column>

      <el-table-column label="添加时间" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTimeStr}}</span>
        </template>
      </el-table-column>

      <el-table-column label="老人数量" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.elderCount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)" />
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <div style="text-align: left">
      <el-dialog
        title="更新"
        :visible.sync="updateDialogVisible"
        width="30%">
        <div class="input-div">
          <p style="width: 100px; text-align: right">机构名称：</p>
          <el-input v-model="updateInfo.name" placeholder="请输入新的机构名称" style="flex: 1"></el-input>
        </div>

        <div class="input-div">
          <p style="width: 100px; text-align: right">机构类型：</p>
          <el-input v-model="updateInfo.type" placeholder="请输入新的机构类型" style="flex: 1"></el-input>
        </div>

        <div class="input-div">
          <p style="width: 100px; text-align: right">机构地址：</p>
          <el-input v-model="updateInfo.address" placeholder="请输入新的机构地址" style="flex: 1"></el-input>
        </div>

        <div class="input-div">
          <p style="width: 100px; text-align: right">省市：</p>
          <v-distpicker :hide-area="true" @province="onUpdateProvince" @city="onUpdateChangeCity" :province="updateInfo.province" :city="updateInfo.city" />
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateAgency">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div style="text-align: left">
      <el-dialog
        title="添加"
        @close="emptyAddInfo"
        :visible.sync="addDialogVisible"
        width="30%">

        <div class="input-div">
          <p style="width: 100px; text-align: right">机构名称：</p>
          <el-input v-model="addInfo.name" placeholder="请输入新的机构名称" style="flex: 1"></el-input>
        </div>

        <div class="input-div">
          <p style="width: 100px; text-align: right">机构类型：</p>
          <el-input v-model="addInfo.type" placeholder="请输入新的机构类型" style="flex: 1"></el-input>
        </div>

        <div class="input-div">
          <p style="width: 100px; text-align: right">机构地址：</p>
          <el-input v-model="addInfo.address" placeholder="请输入新的机构地址" style="flex: 1"></el-input>
        </div>

        <div class="input-div">
          <p style="width: 100px; text-align: right">省市：</p>
          <v-distpicker :hide-area="true" @province="onAddProvince" @city="onAddCity" :province="addInfo.province" :city="addInfo.city" />
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAgency">确 定</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import Pagination from '@/components/Pagination'
  import {isNotNullORBlank} from '@/utils/validate'
  import service from '@/utils/request'

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },

    data() {
      return {
        // 查询条件
        listQuery: {
          name: undefined,
          province: undefined,
          city : undefined,
          offset : 0,
          page : 1,
          pageSize : 10
        },

        // 更新弹窗
        updateDialogVisible: false,
        // 添加弹窗
        addDialogVisible: false,

        // 列表数据，总数，加载中
        list: null,
        total: 0,
        listLoading: true,

        // 添加机构
        addInfo: {
          name:undefined,
          type:undefined,
          address:undefined,
          province: '',
          city: '',
        },

        // 更新机构
        updateInfo: {
          updateId: undefined,
          name:undefined,
          type:undefined,
          address:undefined,
          province: '',
          city: '',
        },
      }
    },

    created() {
      this.getList()
    },

    methods: {
      // address 选择器
      onChangeProvince(data){
        if (data.value == "省") {
          this.listQuery.province = undefined
        } else {
          this.listQuery.province = data.value
        }
      },
      onChangeCity(data){
        if (data.value == "市") {
          this.listQuery.city = undefined
        } else {
          this.listQuery.city = data.value
        }
      },

      onAddProvince(data){
        if (data.value == "省") {
          this.addInfo.province = undefined
        } else {
          this.addInfo.province = data.value
        }
      },
      onAddCity(data){
        if (data.value == "市") {
          this.addInfo.city = undefined
        } else {
          this.addInfo.city = data.value
        }
      },

      onUpdateProvince(data){
        if (data.value == "省") {
          this.updateInfo.province = undefined
        } else {
          this.updateInfo.province = data.value
        }
      },
      onUpdateChangeCity(data){
        if (data.value == "市") {
          this.updateInfo.city = undefined
        } else {
          this.updateInfo.city = data.value
        }
      },

      // 查询列表
      getList() {
        this.listLoading = true
        // 设置偏移量
        this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.pageSize

        service.get("/manage/agency/list", {params: this.listQuery}).then(response => {
          this.listLoading = false
          this.list = response.data
          this.total = response.count
        })
      },

      // 删除
      handleDelete(row) {
        console.log(row)
        this.$confirm('删除[' + row.name + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var _this = this;
          _this.listLoading = true;

          let param = new URLSearchParams()
          param.append("agencyId", row.id)
          service.post("/manage/agency/delete", param)
            .then(resp => {
              console.log(resp)
              _this.listLoading = false;
              if (resp && resp.code == 200) {
                _this.getList();
              }
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      // 添加机构
      addAgency(){
        if (!isNotNullORBlank(this.addInfo.name)) {
          this.$message.warning( '标题不能为空!');
          return;
        }
        if (!isNotNullORBlank(this.addInfo.type)) {
          this.$message.warning( '类型不能为空!');
          return;
        }
        if (!isNotNullORBlank(this.addInfo.address)) {
          this.$message.warning( '类型不能为空!');
          return;
        }

        var _this = this;
        _this.listLoading = true;

        service.post("/manage/agency/insert", {
          address: this.addInfo.address, name:this.addInfo.name, type:this.addInfo.type, province:this.addInfo.province, city:this.addInfo.city
        }).then(resp=> {
          _this.listLoading = false;
          _this.addDialogVisible=false;
          console.log(resp)

          if (resp && resp.code == 200) {
            _this.listLoading = true;
            _this.getList();
          }
        });
      },

      emptyAddInfo(){
        this.addInfo = {
          name: '',
          type: '',
          address: '',
          province: '',
          city: '',
        };
      },

      // 更新
      handleUpdate(row) {
        this.updateInfo.updateId = row.id
        this.updateInfo.name = row.name
        this.updateInfo.type = row.type
        this.updateInfo.address=row.address
        this.updateInfo.province = row.province
        this.updateInfo.city = row.city

        this.updateDialogVisible = true
      },

      updateAgency(){
        if (!isNotNullORBlank(this.updateInfo.name)) {
          this.$message.warning( '标题不能为空!');
          return;
        }
        if (!isNotNullORBlank(this.updateInfo.type)) {
          this.$message.warning( '类型不能为空!');
          return;
        }
        if (!isNotNullORBlank(this.updateInfo.address)) {
          this.$message.warning( '类型不能为空!');
          return;
        }

        this.loading = true;
        var _this = this;

        service.post("/manage/agency/update", {
          id: this.updateInfo.updateId ,address: this.updateInfo.address, name:this.updateInfo.name, type:this.updateInfo.type, province:this.updateInfo.province, city:this.updateInfo.city
        }).then(resp=> {
          _this.updateDialogVisible = false;
          _this.loading = false;

          if (resp && resp.code == 200) {
            _this.updateInfo.updateId =''
            _this.updateInfo.name = ''
            _this.updateInfo.type = ''
            _this.updateInfo.address=''
            _this.updateInfo.province = ''
            _this.updateInfo.city = ''

            _this.listLoading = true
            _this.getList();
          }
        })
      }
    }
  }
</script>
