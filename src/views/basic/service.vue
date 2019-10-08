<template>
  <div class="app-container">
    <div class="filter-container" >
      <div class="left-box">
        <el-input v-model="listQuery.name" placeholder="姓名" class="filter-item" />
        <el-button style="margin-left: 10px;" @click="getList" icon="el-icon-refresh" type="primary">查询</el-button>
      </div>

      <el-button @click="addDialogVisible = true" icon="el-icon-plus" type="primary">添加人员</el-button>
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

      <el-table-column label="当前状态" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.provideState }}</span>
        </template>
      </el-table-column>

      <el-table-column label="添加时间"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)" />
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!--    添加服务人员-->
    <el-dialog
      title="添加服务人员"
      @close="emptyAddInfo"
      :visible.sync="addDialogVisible"
      width="50%">
      <el-form :model="addInfo" :rules="rules" ref="addEmpForm">
        <el-row aria-colcount="2">
          <el-col aria-colindex="0">
            <el-form-item label="姓名:" prop="name">
              <el-input prefix-icon="el-icon-edit" v-model="addInfo.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col aria-colindex="1">
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
          </el-col>
        </el-row>

        <el-row aria-colcount="2">
          <el-col aria-colindex="0">
            <el-form-item label="手机号:" prop="phone" >
              <el-input prefix-icon="el-icon-edit" v-model="addInfo.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col aria-colindex="1">
            <el-form-item label="密码:" prop="pwd" >
              <el-input prefix-icon="el-icon-edit" v-model="addInfo.pwd" placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col >
            <el-form-item label="出生日期:" prop="birth"  >
              <el-date-picker
                v-model="addInfo.birth"
                value-format="yyyyMMdd"
                type="date"
                placeholder="出生日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="家庭地址:" prop="address" style="flex: 1" >
            <v-distpicker @province="onAddProvince" @city="onAddCity" @area="onAddArea" :province="addInfo.province" :city="addInfo.city" :area="addInfo.country"/>
          </el-form-item>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="地址详情:" prop="address" >
              <el-input prefix-icon="el-icon-edit" v-model="addInfo.address" placeholder="请输入地址详情"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <div style="margin: 0 auto">
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible= false">取 消</el-button>
              <el-button type="primary" @click="addItem('addEmpForm')">确 定</el-button>
           </span>
          </div>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog
      title="添加服务人员"
      @close="emptyUpdateInfo"
      :visible.sync="updateDialogVisible"
      width="50%">
      <el-form :model="updateInfo" :rules="rules" ref="addEmpForm">
        <el-row aria-colcount="2">
          <el-col aria-colindex="0">
            <el-form-item label="姓名:" prop="name">
              <el-input prefix-icon="el-icon-edit" v-model="updateInfo.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col aria-colindex="1">
            <el-form-item label="性别:" prop="sex"  >
              <el-select v-model="updateInfo.sex" placeholder="性别">
                <el-option
                  v-for="item in sex_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row aria-colcount="2">
          <el-col aria-colindex="0">
            <el-form-item label="手机号:" prop="phone" >
              <el-input prefix-icon="el-icon-edit" v-model="updateInfo.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col aria-colindex="1">
            <el-form-item label="出生日期:" prop="birth" >
              <el-input prefix-icon="el-icon-edit" v-model="updateInfo.birth" placeholder="请输入出生年月"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="家庭地址:" prop="address" style="flex: 1" >
            <v-distpicker @province="onUpdateProvince" @city="onUpdateCity" @area="onUpdateArea" :province="updateInfo.province" :city="updateInfo.city" :area="updateInfo.country"/>
          </el-form-item>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="地址详情:" prop="address" >
              <el-input prefix-icon="el-icon-edit" v-model="updateInfo.address" placeholder="请输入地址详情"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <div style="margin: 0 auto">
            <span slot="footer" class="dialog-footer">
              <el-button @click="updateDialogVisible= false">取 消</el-button>
              <el-button type="primary" @click="updateItem('addEmpForm')">确 定</el-button>
           </span>
          </div>
        </el-row>
      </el-form>
    </el-dialog>
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
          sex:0,
          phone:undefined,
          pwd:undefined,
          birth:undefined,
          address: undefined,
          province:undefined,
          city:undefined,
          country:undefined,
        },

        updateInfo: {
          id: undefined,
          name: undefined,
          sex:0,
          phone:undefined,
          pwd:undefined,
          birth:undefined,
          address: undefined,
          province:undefined,
          city:undefined,
          country:undefined,
        },

        sex_options: [{id: 0, name: '男'}, {id: 1, name: '女'}],

        rules: {
          name: [{required: true, message: '必填:姓名', trigger: 'blur'}],
          sex: [{required: true, message: '必填:性别', trigger: 'blur'}],
          birth: [{required: true, message: '必填:出生日期', trigger: 'blur'}],
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

      getList(){
        this.listLoading = true;

        // 设置偏移量
        this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.pageSize

        service.get("/manage/service/list", {params: this.listQuery}).then(resp => {
          console.log(resp);
          this.listLoading = false
          this.list = resp.data
          this.total = resp.count
        })
      },

      // 添加服务人员
      addItem(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var _this = this;
            _this.listLoading = true;

            service.post("/manage/service/insert", (this.addInfo)).then(resp=> {
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

      // 更新
      handleUpdate(row) {
        this.updateInfo.id = row.id
        this.updateInfo.name = row.name
        this.updateInfo.sex = row.sex
        this.updateInfo.phone = row.phone
        this.updateInfo.pwd = row.pwd
        this.updateInfo.birth = row.birth
        this.updateInfo.address=row.address
        this.updateInfo.province = row.province
        this.updateInfo.city = row.city
        this.updateInfo.country = row.country

        this.updateDialogVisible = true
      },
      updateItem(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            var _this = this;

            service.post("/manage/service/update", this.updateInfo).then(resp=> {
              _this.updateDialogVisible = false;
              _this.loading = false;

              if (resp && resp.code == 200) {
                _this.listLoading = true
                _this.getList();
              }
            })
          } else {
            return false;
          }
        });
      },
      emptyUpdateInfo(){
        this.updateInfo = {
          id: undefined,
          name: undefined,
          sex:0,
          phone:undefined,
          pwd:undefined,
          birth:undefined,
          address: undefined,
          province:undefined,
          city:undefined,
          country:undefined,
        };
      },
    },
  };
</script>
