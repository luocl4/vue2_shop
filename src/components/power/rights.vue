<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe max-height="550">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'"> 一级</el-tag>
            <el-tag v-if="scope.row.level === '1'" type="success"> 二级</el-tag>
            <el-tag v-if="scope.row.level === '2'" type="warning"> 三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      // 权限列表
      rightsList: [],
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data: res } = await axios.get("rights/list");
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      this.rightsList = res.data;
      // console.log(this.rightsList);
    },
  },
};
</script>

<style scoped>
</style>