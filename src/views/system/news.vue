<template>
  <div class="app-container">
    <div class="filter-container" >
      <div class="left-box">
        <el-input v-model="listQuery.title" placeholder="请输入文章标题" class="filter-item" />
        <el-select v-model="listQuery.type" style="width: 130px;margin: 0 10px;"  placeholder="文章类型">
          <el-option
            v-for="item in type_options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      </div>
      <el-button  class="filter-item" type="primary" icon="el-icon-edit" @click="addDialogVisible = true">添加文章</el-button>
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

      <el-table-column label="文章名称" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>

      <el-table-column label="文章类型" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.type | typeFilter(scope.row.type)}}
        </template>
      </el-table-column>

      <el-table-column label="添加时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTimeStr }}
        </template>
      </el-table-column>

      <el-table-column label="文章内容" align="center">
        <template slot-scope="scope">
          <p class="content-overflow">
            {{ scope.row.content }}
          </p>
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

    <el-dialog
      title="更新文章"
      @close="emptyUpdateInfo"
      :visible.sync="updateDialogVisible"
      width="30%">
      <el-form :model="updateInfo" :rules="rules" ref="addEmpForm">
        <el-row>
          <el-col>
            <el-form-item label="文章标题:" prop="title">
              <el-input prefix-icon="el-icon-edit" v-model="updateInfo.title" placeholder="请输入新的文章标题"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="文章类型:" prop="type">
              <el-select v-model="updateInfo.type"  placeholder="请输入新的文章类型">
                <el-option
                  v-for="item in type_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="文章內容:" prop="content">
              <el-input type="textarea" prefix-icon="el-icon-edit" v-model="updateInfo.content" placeholder="请输入新的文章內容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <div style="margin: 0 auto">
          <span slot="footer" class="dialog-footer">
            <el-button  @click="updateDialogVisible = false">取 消</el-button>
            <el-button type="primary"  @click="updateNews('addEmpForm')">确 定</el-button>
          </span>
          </div>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog
      title="添加文章"
      @close="emptyAddInfo"
      :visible.sync="addDialogVisible"
      width="30%">
      <el-form :model="addInfo" :rules="rules" ref="addEmpForm">
        <el-row>
          <el-col>
            <el-form-item label="文章标题:" prop="title">
              <el-input prefix-icon="el-icon-edit" v-model="addInfo.title" placeholder="请输入新的文章标题"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="文章类型:" prop="type">
              <el-select v-model="addInfo.type"  placeholder="请输入新的文章类型">
                <el-option
                  v-for="item in type_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="文章內容:" prop="content">
              <el-input type="textarea" prefix-icon="el-icon-edit" v-model="addInfo.content" placeholder="请输入新的文章內容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <div style="margin: 0 auto">
          <span slot="footer" class="dialog-footer">
            <el-button  @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary"  @click="addNews('addEmpForm')">确 定</el-button>
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

    filters: {
      typeFilter(type) {
        const type_map ={
          0: '工作动态',
          1: '全名健康',
          2: '孝感天地'
        }
        return type_map[type]
      }
    },
    data() {
      return {
        // 查询条件
        listQuery: {
          title: undefined,
          type:undefined,
          offset : 0,
          page : 1,
          pageSize : 10
        },

        // 列表数据，总数，加载中
        list: null,
        total: 0,
        listLoading: false,

        // 更新弹窗
        updateDialogVisible: false,
        // 添加弹窗
        addDialogVisible: false,

        addInfo: {
          title: undefined,
          type:undefined,
          content:undefined,
        },

        updateInfo: {
          id: undefined,
          title: undefined,
          type:undefined,
          content:undefined,
        },

        // 筛选框
        type_options: [{id: undefined, name: undefined}, {id: 0, name: '工作动态'}, {id: 1, name: '全名健康'}, {id: 2, name: '孝感天地'}],

        rules: {
          title: [{required: true, message: '必填:文章标题', trigger: 'blur'}],
          type: [{required: true, message: '必填:文章类型', trigger: 'blur'}],
          content: [{required: true, message: '必填:文章内容', trigger: 'blur'}],
        },
      };
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true

        // 设置偏移量
        this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.pageSize

        service.get("/manage/news/list", {params: this.listQuery}).then(resp => {
          console.log(resp);
          this.listLoading = false
          this.list = resp.data
          this.total = resp.count
        })
      },

      // 更新
      handleUpdate(row) {
        this.updateInfo.id = row.id
        this.updateInfo.title=row.title
        this.updateInfo.content=row.content
        this.updateInfo.type=row.type

        this.updateDialogVisible = true;
      },
      updateNews(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            var _this = this;

            service.post("/manage/news/update", this.updateInfo).then(resp=> {
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
      emptyUpdateInfo() {
        this.updateInfo = {
          id: undefined,
          title: undefined,
          type: undefined,
          content: undefined,
        };
      },

      addNews(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            var _this = this;

            service.post("/manage/news/insert", this.addInfo).then(resp=> {
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
      emptyAddInfo() {
        this.addInfo = {
          title: undefined,
          type: undefined,
          content: undefined,
        };
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
          param.append("newsId", row.id)
          service.post("/manage/news/delete", param)
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
    }
  }
</script>
