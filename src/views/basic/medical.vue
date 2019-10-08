<template>
  <div class="tab-container">
    <el-tabs v-model="defaultTab" style="margin-top:15px;" type="border-card">
      <el-tab-pane label="预约挂号" name="reserveList">
        <reserve_List state="reserveList"/>
      </el-tab-pane>

      <el-tab-pane label="咨询管理" name="consultList">
        <consult_List state="consultList"/>
      </el-tab-pane>

      <el-tab-pane label="回访管理" name="revisitList">
        <revisit_List state="revisitList"/>
      </el-tab-pane>

      <el-tab-pane label="处方管理" name="prescriptionList">
        <prescription_List state="prescriptionList"/>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
  import consultList from './medical/consultList.vue'
  import prescriptionList from './medical/prescriptionList.vue'
  import revisitList from './medical/revisitList.vue'
  import reserveList from './medical/reserveList.vue'

  export default {
    data() {
      return {
        defaultTab: 'reserveList'
      };
    },
    methods: {},
    components: {
      'consult_List': consultList,
      'prescription_List': prescriptionList,
      'revisit_List': revisitList,
      'reserve_List': reserveList
    }
  };
</script>
