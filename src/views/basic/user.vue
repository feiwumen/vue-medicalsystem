<template>
  <div class="tab-container">
    <el-tabs v-model="defaultTab" style="margin-top:15px;" type="border-card">
      <el-tab-pane label="老人" name="oldUserList" >
        <oldUser_List state="consultList"/>
      </el-tab-pane>

      <el-tab-pane label="儿女" name="childUserList">
        <childUser_List state="revisitList"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import childUserList from './user/childUserList.vue'
  import oldUserList from './user/oldUserList.vue'
  export default {
    data() {
      return {
        defaultTab: 'oldUserList'
      };
    },
    methods: {},
    components: {
      'childUser_List': childUserList,
      'oldUser_List': oldUserList
    }
  };
</script>
