<template>
  <div class="button-form" :style="`padding-bottom:  ${bottom};padding-top:  ${top}`">
    <el-button v-if="showAdd" type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="buttonClick('add')">新增</el-button>
    <el-button v-if="showDelete" size="mini" @click="buttonClick('delete')">删除</el-button>
    <el-button v-if="showView" size="mini" @click="buttonClick('export')">导出</el-button>
    <slot name="moreBtn" />
  </div>
</template>

<script>
export default {
  name: 'ButtonForm',
  props: {
    bottom: String,
    default: () => {
      return '20px'
    },
    top: String,
    default: () => {
      return '0px'
    },
    showAdd: Boolean,
    default: () => {
      return false
    },
    showDelete: Boolean,
    default: () => {
      return false
    },
    showView: Boolean,
    default: () => {
      return false
    }
  },
  data() {
    return {}
  },
  methods: {
    buttonClick(typeName) {
      this.$emit('buttonClick', typeName)
    }
  }
}
</script>

<style lang="scss">
.button-form {
  // box-sizing: border-box;
  margin-bottom: 5px;
}
</style>
