<template>
    <Menu :theme="theme3" active-name="2" width="160px">
        <MenuGroup title="项目管理">
            <MenuItem name="1">
                <Icon type="md-document" />
                创建项目
            </MenuItem>
            <MenuItem name="2">
                <Icon type="md-chatbubbles" />
                项目管理    
            </MenuItem>
        </MenuGroup>
        <!-- <MenuGroup title="统计分析">
            <MenuItem name="3">
                <Icon type="md-heart" />
                用户留存
            </MenuItem>
            <MenuItem name="4">
                <Icon type="md-leaf" />
                流失用户
            </MenuItem>
        </MenuGroup> -->
    </Menu>
    <!-- <br>
    <p>Change theme</p>
    <RadioGroup v-model="theme3">
        <Radio label="light"></Radio>
        <Radio label="dark"></Radio>
    </RadioGroup> -->
</template>
<script>
    export default {
        data () {
            return {
                theme3: 'light'
            }
        }
    }
</script>