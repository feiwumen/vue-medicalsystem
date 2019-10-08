<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  #app{
    font-size: 25px;
    .distpicker-address-wrapper{
      min-width: 315px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      select:nth-of-type(1){
        min-width: 150px;
        margin-right: 10px;
      }
      select:nth-of-type(2){
        min-width: 150px;
        margin-right: 10px;
      }
      select:nth-of-type(3){
        min-width: 150px;
      }
    }
    .filter-container{
      .el-button--primary{
        width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 12px 0;
      }
    }
  }

  .filter-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .filter-item{
      width: 200px;
    }
    .left-box{
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

  }
  .el-table{
    font-size: 16px;
  }

  /*弹窗的输入框样式*/
  .input-div{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
  }

  .el-row{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 0px 15px;
  }

  .el-form-item {
    display: flex;
    justify-content: flex-start;
    .el-form-item__label{
      width: 90px;
    }
    .el-form-item__content{
      flex: 1;
      display: flex;
      justify-content: flex-start;
      padding-right: 10px;
    }
  }

  .tab-container {
    margin: 15px;
  }

  .content-overflow{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }

</style>
