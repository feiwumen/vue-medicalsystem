<template>
  <div class="app-container">
    <div class="filter-container" >
      <div class="left-box">
        <el-input v-model="listQuery.name" placeholder="姓名" class="filter-item" />
        <el-button style="margin-left: 10px;" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      </div>

      <el-button @click="addDialogVisible = true" icon="el-icon-plus" type="primary">添加子女</el-button>
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

      <el-table-column label="姓名" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="手机号" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="出生年月" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.birth }}</span>
        </template>
      </el-table-column>

      <el-table-column label="性别" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>

<!--      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)" />-->
<!--        </template>-->
<!--      </el-table-column>-->

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

<!--    添加子女-->
    <div style="text-align: left">
      <el-dialog
        title="添加子女"
        @close="emptyAddInfo"
        :visible.sync="addDialogVisible"
        width="50%">
        <el-form :model="addInfo" :rules="rules" ref="addEmpForm">
          <div style="text-align: left">
            <el-row>
              <el-col :span="10">
                <div>
                  <el-form-item label="姓名:" prop="name">
                    <el-input prefix-icon="el-icon-edit" v-model="addInfo.name" placeholder="请输入真实姓名"></el-input>
                  </el-form-item>
                </div>
              </el-col>

            </el-row>

            <el-row>
              <el-col :span="10">
                <div>
                  <el-form-item label="手机号:" prop="phone" >
                    <el-input prefix-icon="el-icon-edit" v-model="addInfo.phone"
                              placeholder="请输入手机号"></el-input>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="10">
                <div>
                  <el-form-item label="密码:" prop="pwd">
                    <el-input prefix-icon="el-icon-edit" v-model="addInfo.pwd"
                              placeholder="请输入密码"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="10">
                <div>
                  <el-form-item label="性别:" prop="sex">
                    <el-select v-model="addInfo.sex"  placeholder="性别">
                      <el-option
                        v-for="item in sex_options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="10">
                <div>
                  <el-form-item label="出生日期:" prop="birth">
                    <el-date-picker
                      v-model="addInfo.birth"
                      value-format="yyyyMMdd"
                      type="date"
                      placeholder="出生日期">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible= false">取 消</el-button>
              <el-button type="primary" @click="addChild('addEmpForm')">确 定</el-button>
            </span>

          </div>
        </el-form>

      </el-dialog>
    </div>

  </div>
</template>
<script>
  import waves from '@/directive/waves'
  import Pagination from '@/components/Pagination'
  import service from '@/utils/request'

  export default {
    components: { Pagination },
    directives: { waves },

    data() {
      return {
        // 查询条件
        listQuery: {
          name :undefined,
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
        listLoading: false,

        addInfo: {
          name: undefined,
          phone:undefined,
          birth:undefined,
          sex:0,
          pwd: undefined,
        },

        // 筛选框
        sex_options: [{id: 0, name: '男'}, {id: 1, name: '女'}],

        rules: {
          name: [{required: true, message: '必填:姓名', trigger: 'blur'}],
          sex: [{required: true, message: '必填:性别', trigger: 'blur'}],
          birth: [{required: true, message: '必填:出生日期', trigger: 'blur'}],
          phone: [{required: true, message: '必填:电话号码', trigger: 'blur'}],
          pwd: [{required: true, message: '必填:密码', trigger: 'blur'}],
        },
      };
    },
    mounted() {
      this.getList()
    },

    methods: {
      getList(){
        this.listLoading = true;

        // 设置偏移量
        this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.pageSize

        service.get("/manage/user/listYounger", {params: this.listQuery}).then(resp => {
          console.log(resp);
          this.listLoading = false
          this.list = resp.data
          this.total = resp.count
        })
      },

      handleUpdate(row) {
        this.updateDialogVisible = true
        // TODO 更新信息
      },

      // 更新子女
      updateChild(){

      },

      // 添加子女
      addChild(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var _this = this;
            _this.listLoading = true;

            service.post("/manage/user/insert", (this.addInfo)).then(resp=> {
              _this.listLoading = false;
              _this.addDialogVisible=false;
              console.log(resp)

              if (resp && resp.code == 200) {
                _this.listLoading = true;
                _this.getList();
              }
            });
          } else {
            return false;
          }
        });
      },

      emptyAddInfo(){
        this.addInfo = {
          name: undefined,
          phone:undefined,
          birth:undefined,
          sex:0,
          pwd: undefined,
        };
      },
    },
  };
</script>
