<template>
  <section class="project-panel-container">
    <section class="project-title">
      <h3> <Icon type="ios-book-outline" />  {{item.projectName}}</h3>
      <h4> <Icon type="ios-create-outline" /> {{item.labelTypeName}}</h4>
    </section>
    <section class="project-panel-introduce add-shadow">
      <h4><Icon type="ios-paper-plane-outline" />  项目描述: </h4>
      <p>{{item.projectIntroduceInfo}}</p>
    </section>
    <section class="project-panel-main">
      <section class="project-panel-main-picture add-shadow">
        <h4><Icon type="ios-paper-plane-outline" />  图片示例: </h4>
        <ul>
          <li v-for="(ite, ind) in item.projectPictureList" :key="ind">
            <img :src="ite.projectPictureUrl" alt="">
          </li>
        </ul>
      </section>
      <section class="project-panel-main-step add-shadow">
        <h4><Icon type="ios-paper-plane-outline" />  项目进度</h4>
        <ul>
          <li>项目起始时间: {{item.projectCreateTime}}</li>
          <li>项目更新时间: {{item.projectUpdateTime}}</li>
          <li>项目截至时间: {{item.projectExpiryDate}}</li>
      </ul>
      <Button v-if="item.projectStatus===0" type="success" style="float:right" ghost @click="handleEnterProject(item.projectId)">进入项目</Button>
      <Button v-else-if="item.projectStatus===1" type="success" style="float:right" ghost disabled>已经申请，正在审批</Button>
      <Button v-else-if="item.projectStatus===2" type="success" style="float:right" ghost @click="handleApplyJoin(item.projectId)">申请加入</Button>
      </section>
    </section>
  </section>
</template>

<script>
import { mapMutations, mapActions } from 'vuex' 
import { setSession } from '@/utils/util.js'
export default {
  props: {
    item: Object
  },
  methods: {
    ...mapMutations(['updateProjectId']),
    ...mapActions(['getUserRoles']),
    handleEnterProject (projectId) {
      setSession('slideActiveName', '1')      
      this.updateProjectId(projectId)
      this.getProjectRoles(projectId)
    },
    handleApplyJoin (projectId) {
      this.$emit('applyJoinProject', projectId)
    },
    getProjectRoles(projectId) {
      this.getUserRoles(projectId).then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data);
          this.$router.push({path: '/main/project/detail', query: {id: projectId}})
          try {
            setSession('projectPrivilegeList', data[0].projectPrivilegeList)
            setSession('projectRoleId', data[0].projectRoleId)
          } catch (e) {
            console.log(e.message)
          }
        } else {
          this.$Message.error(res.data.message);
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
.project-panel-container {
  margin: 20px;
  padding: 20px;
  background: #fff;
  border: 1px solid rgba(50, 158, 230, 0.7);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  &:hover {
    box-shadow: rgb(50, 158, 230) 0px 0px 28px;
  }
  .add-shadow {
    box-shadow: -2px 0 0 rgb(50, 158, 230);
    border-radius: 5px;
  }
  .project-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    h4 {
      margin: 0;
    }
  }
  h3 {
    font-size: 20px;
  }
  h4 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  .project-panel-introduce {
    padding: 15px;
    margin: 15px 0px;
    border: 1px solid #eee;
    p { 
      font-size: 16px;
      color: rgb(56, 66, 75);
      font-family: "楷体";
      font-weight: 550;
      text-indent:25px;
      letter-spacing: 2px;
    }
  }
  .project-panel-main {
    display: flex;
    flex-direction: row;
    .project-panel-main-picture {
      flex: 1;
      padding: 15px;
      margin: 5px 10px 0px 0px;
      border: 1px solid #eee;
      ul {
        margin: 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        li {
          width: 120px;
          list-style: none;
          margin: 5px 10px;
          padding: 5px;
          border: 1px dashed #ccc;
          border-radius: 5px;
          img {
            width: 100%;
          }
        }
      }
    }
    .project-panel-main-step {
      position: relative;
      flex: 1;
      padding: 15px;
      margin: 5px 0px 0px 10px;
      border: 1px solid #eee;
      button {
        position: absolute;
        right: 20px;
        bottom: 20px;
      }
      ul {
        margin: 0;
        display: flex;
        flex-direction: column;
        li {
          list-style: none;
        }
      }
    }
  }
}
</style>
