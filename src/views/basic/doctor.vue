<template>
  <div class="app-container">
    <div class="filter-container" >
      <div class="left-box">
        <el-input v-model="listQuery.name" placeholder="医生名称" class="filter-item" />
        <v-distpicker style="margin-left: 10px;" @province="onChangeProvince" @city="onChangeCity" @area="onChangeArea"></v-distpicker>
        <el-button style="margin-left: 10px;" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      </div>
      <el-button  class="filter-item" type="primary" icon="el-icon-edit" @click="addDialogVisible = true">添加医生</el-button>
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

      <el-table-column label="姓名" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="医院名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.hospital }}</span>
        </template>
      </el-table-column>

      <el-table-column label="一级科室" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.department }}</span>
        </template>
      </el-table-column>

      <el-table-column label="二级科室" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.secondDepartment }}</span>
        </template>
      </el-table-column>

      <el-table-column label="职务" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jobTitle}}</span>
        </template>
      </el-table-column>

      <el-table-column label="手机号" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone}}</span>
        </template>
      </el-table-column>

      <el-table-column label="擅长" width="100px"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skill }}</span>
        </template>
      </el-table-column>

      <el-table-column label="添加时间" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTimeStr }}</span>
        </template>
      </el-table-column>

      <el-table-column label="签约老人"  width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.elderCount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)" />
          <!--          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />-->
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <div style="text-align: left">
      <el-dialog
        title="更新"
        :visible.sync="updateDialogVisible"
        @close="emptyUpdateInfo"
        width="50%">
        <div class="input-div">
          <p style="width: 100px; text-align: right">医生名称：</p>
          <el-input v-model="updateInfo.name" placeholder="请输入新的医生名称" style="flex: 1"></el-input>
        </div>

        <div class="input-div">
          <p style="width: 100px; text-align: right">医生类型：</p>
          <el-input v-model="updateInfo.type" placeholder="请输入新的医生类型" style="flex: 1"></el-input>
        </div>

        <div class="input-div">
          <p style="width: 100px; text-align: right">医生地址：</p>
          <el-input v-model="updateInfo.address" placeholder="请输入新的医生地址" style="flex: 1"></el-input>
        </div>

        <div class="input-div">
          <p style="width: 100px; text-align: right">省市：</p>
          <v-distpicker @province="onUpdateProvince" @city="onUpdateCity" @area="onUpdateArea" :province="updateInfo.province" :city="updateInfo.city" :area="updateInfo.country"/>
        </div>

        <div class="input-div">
          <p style="width: 100px; text-align: right">简介：</p>
          <el-input v-model="updateInfo.introduction" placeholder="请输入新的医生简介" style="flex: 1"></el-input>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateHospital">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div style="text-align: left">
      <el-dialog
        title="添加"
        @close="emptyAddInfo"
        :visible.sync="addDialogVisible"
        width="50%">
        <div class="input-div">
          <p style="width: 100px; text-align: right">医生名称：</p>
          <el-input v-model="addInfo.name" placeholder="请输入新的医生名称" style="flex: 1"></el-input>
        </div>

        <div class="input-div">
          <p style="width: 100px; text-align: right">医生类型：</p>
          <el-input v-model="addInfo.type" placeholder="请输入新的医生类型" style="flex: 1"></el-input>
        </div>

        <div class="input-div">
          <p style="width: 100px; text-align: right">医生地址：</p>
          <el-input v-model="addInfo.address" placeholder="请输入新的医生地址" style="flex: 1"></el-input>
        </div>

        <div class="input-div">
          <p style="width: 100px; text-align: right">省市：</p>
          <v-distpicker @province="onAddProvince" @city="onAddCity" @area="onAddArea" :province="addInfo.province" :city="addInfo.city" :area="addInfo.country"/>
        </div>

        <div class="input-div">
          <p style="width: 100px; text-align: right">简介：</p>
          <el-input v-model="addInfo.introduction" placeholder="请输入新的医生简介" style="flex: 1"></el-input>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addHospital">确 定</el-button>
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
          country: undefined,
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

        // 添加医生
        addInfo: {
          name:undefined,
          type:undefined,
          introduction:undefined,
          address:undefined,
          province: '',
          city: '',
          country: '',
        },

        // 更新医生
        updateInfo: {
          id: undefined,
          name:undefined,
          type:undefined,
          introduction:undefined,
          address:undefined,
          province: '',
          city: '',
          country: '',
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
      onChangeArea(data){
        if (data.value == "区") {
          this.listQuery.country = undefined
        } else {
          this.listQuery.country = data.value
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
      onAddArea(data){
        if (data.value == "区") {
          this.addInfo.country = undefined
        } else {
          this.addInfo.country = data.value
        }
      },

      onUpdateProvince(data){
        if (data.value == "省") {
          this.updateInfo.province = undefined
        } else {
          this.updateInfo.province = data.value
        }
      },
      onUpdateCity(data){
        if (data.value == "市") {
          this.updateInfo.city = undefined
        } else {
          this.updateInfo.city = data.value
        }
      },
      onUpdateArea(data){
        if (data.value == "区") {
          this.updateInfo.country = undefined
        } else {
          this.updateInfo.country = data.value
        }
      },

      // 查询列表
      getList() {
        this.listLoading = true
        // 设置偏移量
        this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.pageSize

        service.get("/manage/doctor/list", {params: this.listQuery}).then(response => {
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
          param.append("id", row.id)
          service.post("/manage/hospital/delete", param)
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

      // 添加医生
      addHospital(){
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

        service.post("/manage/hospital/insert", this.addInfo).then(resp=> {
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
          name:undefined,
          type:undefined,
          introduction:undefined,
          address:undefined,
          province: '',
          city: '',
          country: '',
        };
      },

      // 更新
      handleUpdate(row) {
        this.updateInfo.id = row.id
        this.updateInfo.name = row.name
        this.updateInfo.type = row.type
        this.updateInfo.introduction = row.introduction
        this.updateInfo.address=row.address
        this.updateInfo.province = row.province
        this.updateInfo.city = row.city

        this.updateDialogVisible = true
      },

      updateHospital(){
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

        service.post("/manage/hospital/update", this.updateInfo).then(resp=> {
          _this.updateDialogVisible = false;
          _this.loading = false;

          if (resp && resp.code == 200) {
            _this.listLoading = true
            _this.getList();
          }
        })
      },

      emptyUpdateInfo(){
        this.addInfo = {
          id: undefined,
          name:undefined,
          type:undefined,
          introduction:undefined,
          address:undefined,
          province: '',
          city: '',
          country: '',
        };
      },
    }
  }
</script>
