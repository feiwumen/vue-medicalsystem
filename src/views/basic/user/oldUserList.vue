<template>
  <div class="app-container">
    <div class="filter-container" >
      <div class="left-box">
        <el-select v-model="listQuery.provideState" placeholder="养老类型">
          <el-option v-for="item in provideState" :key="item" :label="item" :value="item" />
        </el-select>

        <el-select style="margin-left: 10px;"  v-model="listQuery.agency"  placeholder="所属机构">
          <el-option v-for="item in agency" :key="item" :label="item" :value="item" />
        </el-select>

        <el-date-picker style="margin-left: 10px;" v-model="listQuery.birth" value-format="yyyyMMdd" type="date" placeholder="出生日期" />

        <el-button style="margin-left: 10px;" @click="getList" icon="el-icon-refresh" type="primary">查询</el-button>
      </div>

      <el-button @click="addDialogVisible = true" icon="el-icon-plus" type="primary">添加老人</el-button>
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

      <el-table-column label="性别" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
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

      <el-table-column label="民族" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nation }}</span>
        </template>
      </el-table-column>

      <el-table-column label="养老类型" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.provideState }}</span>
        </template>
      </el-table-column>

      <el-table-column label="住址"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

<!--      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)" />-->
<!--        </template>-->
<!--      </el-table-column>-->

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

<!--    添加老人-->
    <div style="text-align: left">
      <el-dialog
        title="添加老人"
        @close="emptyAddInfo"
        :visible.sync="addDialogVisible"
        width="50%">
        <el-form :model="addInfo" :rules="rules" ref="addEmpForm">
          <div style="text-align: center">
            <el-row>
              <el-col :span="10">
                <div>
                  <el-form-item label="真实姓名:" prop="name">
                    <el-input prefix-icon="el-icon-edit" v-model="addInfo.name" placeholder="请输入真实姓名"></el-input>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="10">
                <div>
                  <el-form-item label="身份证号:" prop="identity" >
                    <el-input prefix-icon="el-icon-edit" v-model="addInfo.identity" placeholder="请输入身份证号"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="10">
                <div>
                  <el-form-item label="手机号:" prop="phone" >
                    <el-input prefix-icon="el-icon-edit" v-model="addInfo.phone" placeholder="请输入手机号"></el-input>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="10">
                <div>
                  <el-form-item label="密码:" prop="pwd" >
                    <el-input prefix-icon="el-icon-edit" v-model="addInfo.pwd" placeholder="请输入密码"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="10">
                <div>
                  <el-form-item label="性别:" prop="sex"  >
                    <el-select v-model="addInfo.sex" placeholder="性别">
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
                  <el-form-item label="民族:" prop="nation"  >
                    <el-input prefix-icon="el-icon-edit" v-model="addInfo.nation" placeholder="请输入民族"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-row>

              <el-col :span="10">
                <div>
                  <el-form-item label="出生日期:" prop="birth"  >
                    <el-date-picker
                      v-model="addInfo.birth"
                      value-format="yyyyMMdd"
                      type="date"
                      placeholder="出生日期">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="10">
                <div>
                  <el-form-item label="老人类型:" prop="old_type"  >
                    <el-select v-model="addInfo.oldType" placeholder="老人类型">
                      <el-option
                        v-for="item in old_type_options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="10">
                <div>
                  <el-form-item label="婚姻状况:" prop="marital_status"  >
                    <el-select v-model="addInfo.maritalStatus" placeholder="婚姻状况">
                      <el-option
                        v-for="item in marital_status_option"
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
                  <el-form-item label="居住情况:" prop="live_status"  >
                    <el-select v-model="addInfo.liveStatus"  placeholder="居住情况">
                      <el-option
                        v-for="item in live_status_option"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-form-item label="家庭地址:" prop="address"  >
                <v-distpicker :hide-area="true" @province="onAddProvince" @city="onAddCity" :province="addInfo.province" :city="addInfo.city" />
              </el-form-item>
            </el-row>

            <el-row>
              <el-col>
                <div>
                  <el-form-item label="地址详情:" prop="address" >
                    <el-input prefix-icon="el-icon-edit" v-model="addInfo.address" style="min-width: 500px"
                              placeholder="请输入地址详情"></el-input>

                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="10">
                <div>
                  <el-form-item label="所属社区:" prop="community" >
                    <el-input prefix-icon="el-icon-edit" v-model="addInfo.community"
                              placeholder="请输入所属社区"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="10">
                <div>
                  <el-form-item label="居家养老:" prop="provide_state">
                    <el-input prefix-icon="el-icon-edit" v-model="addInfo.provideState"
                              placeholder="请输入居家养老"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible= false">取 消</el-button>
              <el-button type="primary" @click="addElder('addEmpForm')">确 定</el-button>
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
          provideState: undefined,
          agency: undefined,
          birth :undefined,
          offset : 0,
          page : 1,
          pageSize : 10
        },

        // 养老类型
        provideState: [],
        // 所属机构
        agency: [],

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
          identity: undefined,
          phone:undefined,
          pwd:undefined,
          sex:0,
          nation:undefined,
          birth:undefined,
          oldType:undefined,
          maritalStatus:undefined,
          liveStatus:0,
          address: undefined,
          province:undefined,
          city:undefined,
          community: undefined,
          provideState: 0,
        },

        // 筛选框
        provide_state_options:[{id: 0, name: '未知'}, {id: 1, name: '机构养老'}, {id: 2, name: '以房养老'}],
        sex_options: [{id: 0, name: '男'}, {id: 1, name: '女'}],
        old_type_options: [{id: 0, name: '孤寡老人'}, {id: 1, name: '有子女'}, {id: 2, name: '其它'}],
        marital_status_option: [{id: 0, name: '未婚'}, {id: 1, name: '已婚'}, {id: 2, name: '离异'},{id: 3, name: '丧偶'}],
        live_status_option: [{id: 0, name: '独自居住'}, {id: 1, name: '子女同住'}, {id: 2, name: '其它'}],

        rules: {
          name: [{required: true, message: '必填:姓名', trigger: 'blur'}],
          sex: [{required: true, message: '必填:性别', trigger: 'blur'}],
          birth: [{required: true, message: '必填:出生日期', trigger: 'blur'}],
          identity: [{
            required: true,
            message: '必填:身份证号码',
            trigger: 'blur'
          }, {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: '身份证号码格式不正确',
            trigger: 'blur'
          }],
          phone: [{required: true, message: '必填:电话号码', trigger: 'blur'}],
          pwd: [{required: true, message: '必填:密码', trigger: 'blur'}],
          address: [{required: true, message: '必填:联系地址', trigger: 'blur'}],
        },
      };
    },
    mounted() {
      this.getList()
    },

    methods: {
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

      getList(){
        this.listLoading = true;

        // 设置偏移量
        this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.pageSize

        service.get("/manage/user/listElder", {params: this.listQuery}).then(resp => {
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

      // 更新老人
      updateElder(){

      },

      // 添加老人
      addElder(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var _this = this;
            _this.listLoading = true;

            service.post("/manage/user/insertElder", (this.addInfo)).then(resp=> {
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
          identity: undefined,
          phone:undefined,
          pwd:undefined,
          sex:0,
          nation:undefined,
          birth:0,
          oldType:undefined,
          maritalStatus:undefined,
          liveStatus:0,
          address: undefined,
          province:undefined,
          city:undefined,
          community: undefined,
          provideState: 0,
        };
      },
    },
  };
</script>
