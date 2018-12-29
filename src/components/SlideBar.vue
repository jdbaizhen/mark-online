<template>
    <Menu :active-name=activeName width="180px" @on-select="handleSelect">
        <MenuGroup title="项目管理">
            <MenuItem name="1" to="/main/project/detail">
                <Icon type="md-document" />
                 项目介绍
            </MenuItem>
            <MenuItem v-show="search_task_list" name="2" to='/main/project/task'>
                 <Icon type="md-chatbubbles" />
                任务管理
            </MenuItem>
            <MenuItem v-show="project_member_list" name="3" to="/main/project/person">
                <Icon type="ios-people" />
                人员分配
            </MenuItem>
            <MenuItem v-show="picture_list" name="4" to="/main/project/warehouse">
                <Icon type="md-photos" />
                素材管理
            </MenuItem>
            <MenuItem name="5" to="/main/project/statistics">
                <Icon type="ios-paper" />
                数据统计
            </MenuItem>
        </MenuGroup>
    </Menu>
</template>
<script>
import { setSession, getSession, assignPrivilege } from '@/utils/util.js'
export default {
  data () {
    return {
      activeName: '1',
      /**
       * 权限
       */
      search_project_introduce: false,
      search_task_list: false,
      project_member_list: false,
      picture_list: false
    }
  },
  mounted () {
    let activeName = getSession('slideActiveName') === undefined ? '1' : getSession('slideActiveName')
    this.activeName = activeName
    this.getInitPrivilege()
  },
  methods: {
    //初始化权限
    getInitPrivilege () {
      try {
        let privilegeList= getSession('privilegeList').split(',')
        let projectPrivilegeList= getSession('projectPrivilegeList').split(',')
        this.search_project_introduce = assignPrivilege(privilegeList, 'search_project_introduce')
        this.search_task_list = assignPrivilege(projectPrivilegeList, 'search_task_list')
        this.project_member_list = assignPrivilege(privilegeList, 'project_member_list')
        this.picture_list = assignPrivilege(privilegeList, 'picture_list')
      } catch (e) {
        console.log(e.message)
      }
    },
    handleSelect (value) {
      setSession('slideActiveName', value)
      this.activeName = value
    }
  }
}
</script>
<style scoped>
ul {
    height: 100%;
}
</style>
