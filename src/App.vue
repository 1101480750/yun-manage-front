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
.paginationCont {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 0;
  box-sizing: border-box;
}
.el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 40px;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 40px;
}
.site-sidebar {
  position: fixed;
  top: 0px;
  left: 0;
  bottom: 0;
  z-index: 1020;
  width: 230px;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  padding-top: 60px;
  scrollbar-width: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .site-sidebar__inner {
    width: 100%;
    height: 100%;
    .el-menu {
      width: 100%;
      height: 100%;
      overflow: hidden;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        width: 0;
      }
    }
  }
}
.site-sidebar__menu {
  overflow-y: auto !important;
}
body .el-table th.gutter {
  display: table-cell !important;
}

.operationCont {
  padding-top: 20px;
  // padding-bottom: 20px;
  box-sizing: border-box;
  overflow-y: hidden;
}
.operationCont-hasButton {
  padding-top: 20px;
  box-sizing: border-box;
}
</style>

