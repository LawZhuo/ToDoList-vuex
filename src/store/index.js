import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  //state提供唯一的公共数据源
  state: {
    //数据列表
    list: [],
    //文本框的内容
    inputValue: '请输入任务',
    //下一个任务的id
    nextId: 5,
    //展示的列表数据
    viewKey: 'all'
  },

  //Mutation变更state中的数据
  mutations: {
    initList(state, list) {
      state.list = list;
    },
    //为store中的inputValue赋值
    setInputValue(state, val) {
      state.inputValue = val;
    },
    //添加列表项目
    addItem(state) {
      const obj = {
        // id为列表下一个id
        id: state.nextId,
        // info为输入框内容 
        info: state.inputValue.trim(),
        // 默认为完成
        done: false
      };
      // 将新建的任务列表添加到list中
      state.list.push(obj);
      //id自增
      state.nextId++;
      //新建任务后清空输入框
      state.inputValue = " ";
    },
    //根据id删除对应的事件方法
    removeItem(state, id) {
      //根据id查找对应项的索引
      const i = state.list.findIndex(x => {
        return x.id === id
      });
      // 根据索引删除对应的元素
      if (i !== -1) {
        state.list.splice(i, 1);
      }
    },
    //修改列表项的选中状态
    changeStatus(state, param) {
      //查找索引
      const i = state.list.findIndex(x => {
        return x.id === param.id
      });
      // 根据索引修改选中状态
      if (i !== -1) {
        state.list[i].done = param.status;
      }
    },
    //清除已完成的任务事件方法
    cleanDone(state) {
      //过滤未完成的任务 并把未完成的列表传给state的列表
      state.list = state.list.filter(x => {
        return x.done === false
      })
    },
    //修改视图的关键字
    changeViewKey(state, key) {
      state.viewKey = key
    }
  },
  //异步操作，间接变更数据
  actions: {
    getList(context) {
      //使用axios请求获取数据
      axios.get('/list.json').then(({ data }) => {
        // console.log(data)
        context.commit('initList', data);
      })
    }
  },
  //对state中的数据进行加工处理返回新的数据
  getters: {
    //统计未完成的任务的条数
    unDoneLength(state) {
      var a = state.list.filter(x => {
        return x.done === false;
      });
      return a.length;
    },
    //按需显示数据
    infoList(state) {
      //显示所有数据
      if (state.viewKey === 'all') {
        return state.list;
      }
      // 显示未完成数据
      else if (state.viewKey === 'undone') {
        return state.list.filter(x => {
          return !x.done;
        })
      }
      // 显示已完成数据
      else if (state.viewKey === 'done') {
        return state.list.filter(x => {
          return x.done;
        })
      };
      return state.list;
    }
  }
})
