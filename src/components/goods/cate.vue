<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-if="scope.row.cat_level === 2"
            >三级</el-tag
          >
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteCate(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 编辑名字的对话框 -->
      <el-dialog
        title="修改分类"
        :visible.sync="editDialogVisible"
        width="30%"
        @close="editDialogClosed"
      >
        <el-form
          :model="editCateForm"
          :rules="addCateFormRules"
          ref="editFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input> </el-form-item
        ></el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editName">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 删除用的对话框 -->
      <el-dialog
        title="删除分类"
        :visible.sync="deleteDialogVisible"
        width="30%"
        @close="deleteDialogClosed"
      >
        <!-- <i class="el-icon-warning"></i>
        <span>此操作将永久删除该文件, 是否继续?</span> -->
        <el-alert
          title="此操作将永久删除该文件, 是否继续?"
          show-icon
          type="warning"
          :closable="false"
        ></el-alert>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteCateSure">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="30%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader
        ></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类的数据列表，默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      columns: [
        { label: "分类名称", prop: "cat_name" },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      addCateDialogVisible: false,
      addCateForm: { cat_name: "", cat_pid: 0, cat_level: 0 },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedKeys: [],
      editDialogVisible: false,
      editCateForm: { cat_name: "", cat_id: 0 },
      deleteId: 0,
      deleteDialogVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await axios.get("categories", {
        params: this.querInfo,
      });
      if (res.meta.status !== 200) {
        return this.$$message.error("获取商品分类失败");
      }
      // console.log(res);
      this.catelist = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    async getParentCateList() {
      const { data: res } = await axios.get("categories", {
        params: {
          type: 2,
        },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败");
      }
      // console.log(res.data);
      this.parentCateList = res.data;
    },
    parentCateChanged() {
      // console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    addCate() {
      // console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await axios.post("categories", this.addCateForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    // 编辑按钮的点击事件
    edit(cate) {
      // console.log(cate);
      this.editDialogVisible = true;
      this.editCateForm.cat_name = cate.cat_name;
      this.editCateForm.cat_id = cate.cat_id;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
      this.editCateForm.cat_id = 0;
    },
    editName() {
      // console.log(this.editCateForm.cat_name, this.editCateForm.cat_id);
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await axios.put(
          `categories/${this.editCateForm.cat_id}`,
          this.editCateForm
        );
        if (res.meta.status !== 200) {
          return this.$message.error("编辑分类名称失败");
        }
        this.$message.success("编辑分类名称成功");
        this.getCateList();
        this.editDialogVisible = false;
      });
    },
    deleteCate(cate) {
      this.deleteId = cate.cat_id;
      this.deleteDialogVisible = true;
    },
    deleteDialogClosed() {
      this.deleteId = 0;
    },
    async deleteCateSure() {
      // console.log(this.deleteId);
      const { data: res } = await axios.delete(`categories/${this.deleteId}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除分类失败");
      }
      this.$message.success("删除分类成功");
      this.getCateList();
      this.deleteDialogVisible = false;
    },
  },
};
</script>

<style scoped>
.treeTable {
  margin-top: 15px;
}
</style>