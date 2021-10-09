<template>
  <div id="app">
    <span class="titleText">ToDoList</span>
    <template>
      <!-- 头部区域 -->
      <a-input placeholder="请输入任务" class="my_ipt" :value="inputValue" @change="handlerInputChange"/>
      <a-button type="primary" @click="addItemToList">添加事项</a-button>
    </template>

    <a-list bordered :dataSource="infoList" class="dt_list">
      <!-- 表单主体区域 -->
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- 复选框 -->
        <a-checkbox :checked="item.done" @change="(e) => {cbStatusChanged(e, item.id)}">{{item.info}}</a-checkbox>
        <!-- 删除链接 -->
        <a href="#" slot="actions" @click="removeItemById(item.id)">删除</a>
      </a-list-item>

      <!-- footer区域 -->
      <div slot="footer" class="footer">
        <!-- 未完成的任务个数 -->
        <span>{{unDoneLength}}条剩余</span>
        <!-- 操作按钮 -->
        <a-button-group>
          <a-button :type="viewKey === 'all' ? 'primary' : 'default'" @click="changeList('all')">全部</a-button>
          <a-button :type="viewKey === 'undone' ? 'primary' : 'default'" @click="changeList('undone')">未完成</a-button>
          <a-button :type="viewKey === 'done' ? 'primary' : 'default'" @click="changeList('done')">已完成</a-button>
        </a-button-group>
        <!-- 清除已完成 -->
        <a @click="clean">清除已完成</a>
      </div>
    </a-list>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'app',
  data() {
    return {}
  },
  created() {
    // 触发action中的异步操作
    this.$store.dispatch('getList');
  },
  computed: {
    // 访问state中的数据
    ...mapState(['inputValue', 'viewKey']),
    ...mapGetters(['unDoneLength', 'infoList']),
  },
  methods: {
    // 监听文本框内容变化
    handlerInputChange(e) {
      // console.log(e.target.value);
      this.$store.commit('setInputValue', e.target.value);
    },
    //向列表中新增item项
    addItemToList() {
      if (this.inputValue.trim().length <= 0) {
        return this.$message.warning('文本框不能为空！');
      };
      //调用addItem方法添加任务事件
      this.$store.commit('addItem');
    },
    //根据id删除对应的任务事件
    removeItemById(id) {
      // console.log(id);
      //调用removeItem方法触发删除事件
      this.$store.commit('removeItem', id);
    },
    //监听复选框中状态变化的事件
    cbStatusChanged(e, id) {
      //通过e.target.checked可以获取复选框最新的选中状态
      const param = {
        id: id,
        status: e.target.checked
      };
      this.$store.commit('changeStatus', param);
    },
    //清除已完成的任务事件
    clean() {
      this.$store.commit('cleanDone')
    },
    //修改页面上展示的列表数据
    changeList(key) {
      // console.log(key)
      this.$store.commit('changeViewKey', key)
    }
  }
};
</script>

<style>
#app {
  width: 600px;
  height: 500px;
  margin: 0 auto;
  margin-top: 100px;
}
#app .my_ipt {
  width: 500px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.dt_list {
  width: 100%;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#app .titleText {
  display: block;
  height: 50px;
  /* border: 1px solid #ccc; */
  text-align: center;
  line-height: 50px;
  font-size: 30px;
  font-family: 'Microsoft YaHei';
  color: dodgerblue;
}
</style>
