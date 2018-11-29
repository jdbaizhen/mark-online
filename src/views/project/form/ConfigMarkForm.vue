<template>
  <section>
      <section class="config-mark-form">
        <section class="content">
          <section class="header-operate">
            <Input type="text" placeholder="输入名称" v-model="newName"/>
            <Button type="primary" @click="handleAddAttr">+</Button>
          </section>
          <section class="main-operate">
            <i-select v-model="activeName" placeholder="选择属性" @on-change="handleChangeAttr">
              <i-option v-for="(item, index) in names" :key="index" :value="item">{{item}}</i-option>
            </i-select>
            <i-form 
              ref="activeMarkGoods"
              :model="activeMarkGoods"
              :rules="activeMarkGoodsFormRules"
              label-position="left"
              :label-width="60"
              >
              <FormItem label='名称' prop="name">
                <Input v-model="activeName" disabled placeholder='名称'/>
              </FormItem>
              <FormItem label='描述' prop="description">
                <Input v-model="activeMarkGoods.description" placeholder='描述'/>
              </FormItem>
                <FormItem label='类型' prop="type">
                  <i-select placeholder="选择类型" v-model="activeMarkGoods.type">
                    <i-option v-for="(item, index) in attrTypes" :key="index" :value="item.type">{{item.label}}</i-option>
                  </i-select>
                </FormItem>
                <FormItem label='属性' prop="attrs">
                  <Input type="textarea" v-model="activeMarkGoods.attrs" placeholder='属性定义,每个属性之间用/分隔开'/>
                </FormItem>
                <FormItem style="margin-bottom:0"> 
                  <Button type="success" @click="submitActiveMarkGoods('activeMarkGoods')" ghost style="margin-right: 20px">确认</Button>
                  <Button type="primary" @click="deleteActiveMarkGoods" ghost>清空</Button>
                </FormItem>
            </i-form>
          </section>
        </section>
        <section class="footer-operate">
          <h4>效果预览区域</h4>
          <i-select v-for="(item, index) in markGoods" :key="index" :multiple="item.type==='checkbox'?true:false" :placeholder="item.description">
            <i-option v-for="(ite, idx) in item.attrs.split('/')" :key="idx" :value="ite">{{ite}}</i-option>
          </i-select>
        </section>
      </section>
  </section>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      newName: null, // 当前的新建标注物品
      names: [], // 所有标注物品
      activeName: null, // 当前选中的标注物品
      activeNameIndex: null, // 当前选中的标注物品索引
      attrTypes: [
        { label: "单选", type: "radio" },
        { label: "多选", type: "checkbox" }
      ],
      markGoods: [], // 所有的标注物品
      activeMarkGoods: {
        // 当前标注物品
        name: null,
        description: null,
        type: null,
        attrs: null
      },
      activeMarkGoodsFormRules: {
        name: [
          { required: true, message: '请在属性栏选择属性', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入提示词', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '选择标注类型', trigger: 'blur' }
        ],
        attrs: [
          { required: true, message: '输入不能为空,属性之间使用/分割开', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    ...mapMutations(['updateMarkGoods']),
    handleAddAttr() {
      if (this.newName) {
        if (this.names.length === this.markGoods.length) {
          let newName = this.newName;
          if (this.names.includes(newName)) {
            this.$Message.error("此属性已经被定义");
          } else {
            this.names.push(newName);
            this.activeName = this.names[this.names.length - 1];
            this.activeNameIndex = this.names.length - 1;
          }
        } else {
          this.$Message.error("请先完成当前标注信息配置");
        }
      } else {
        this.$Message.error('请输入要标注的物品')
      }
    },
    // 更改选中项
    handleChangeAttr(value) {
      let index = this.names.indexOf(value)
      this.activeNameIndex = index;
      if (this.markGoods[index] !== undefined) {
        this.activeMarkGoods = this.markGoods[index];
      } else {
        this.activeMarkGoods.description = null;
        this.activeMarkGoods.type = null;
        this.activeMarkGoods.attrs = null;
      }
    },
    // 确定添加标注物品
    submitActiveMarkGoods(name) {
      this.activeMarkGoods.name = this.activeName;
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (confirm("确认提交？")) {
            if (this.markGoods[this.activeNameIndex]) {
              this.markGoods.splice(
                this.activeNameIndex,
                1,
                this.activeMarkGoods
              );
            } else {
              this.markGoods.push(this.activeMarkGoods);
            }
            this.deleteActiveMarkGoods();
          }
        }
      })
    },
    // 清空表单数据
    deleteActiveMarkGoods() {
      this.activeName = null;
      this.activeNameIndex = null;
      this.activeMarkGoods = {
        name: null,
        description: null,
        type: null,
        attrs: null
      };
    }
  },
  watch: {
    'markGoods': function (newMarkGoods) {
      this.updateMarkGoods(newMarkGoods)
    }
  }
};
</script>

<style lang="less" scoped>
.config-mark-form {
  display: flex;
  flex-direction: row;
  padding: 20px;
  border: 1px solid rgba(230, 203, 203, 0.5);
  box-shadow: 1px 1px 1px #ccc;
  .content {
    flex: 2;
    display: flex;
    flex-direction: column;
    .header-operate {
      display: flex;
      flex-direction: row;
      margin: 10px 0px;
    }
    .main-operate {
      display: flex;
      flex-direction: column;
      margin: 10px 0px;
      form {
        margin: 20px 0px;
        padding: 20px;
        border: 1px solid rgba(230, 203, 203, 0.5);
        box-shadow: 1px 1px 1px #ccc;
      }
    }
  }
  .footer-operate {
    flex: 1;
    padding: 20px;
    margin-left: 20px;
    .ivu-select{
      margin: 10px 0px;
    }
  }
}
</style>
