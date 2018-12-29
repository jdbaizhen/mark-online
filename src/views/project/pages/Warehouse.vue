<template>
  <section class="ware-container">
    <header>
      <v-title title="素材管理"/>
      <Tooltip content="请上传rar/zip类型的压缩包" placement="right">
        <Upload 
          action=""
          :max-size="30720"
          :before-upload="beforeUploadFile"  
        >
          <Button icon="ios-cloud-upload-outline" :loading="warehouse.uploadLoading">上传素材</Button>
      </Upload>          
      </Tooltip>
    </header>
    <main>
      <Spin fix v-if="warehouse.loading"></Spin>
      <ul v-show="imageList.length>0" @click="handleImage($event)">
        <li v-for="(item, index) in imageList" :key="index">
          <img :src="item.imagePath" alt="">
          <section>
            <p>图片名： {{item.imageName}}</p>
            <p>入库时间： {{item.imageUploadTime}}</p>
          </section>
        </li>
      </ul>
      <nothing v-show="imageList.length===0" title="暂无数据"/>
    </main>
    <footer>
      <Page 
        :current="warehouse.searchInfo.pageIndex"
        :total="warehouse.pageCount" 
        style="float:right" 
        show-elevator  
        @on-change="handleChangePageIndex"/>
    </footer>
  </section>
</template>

<script>
import Title from '@/components/Title.vue'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    'v-title': Title,
    'nothing': () => import('@/components/Nothing.vue')
  },
  data () {
    return {
      imageList: []
    }
  },
  mounted () {
    this.getProjectIdMutation()
    this.getImageList()
  },
  methods: {
    ...mapMutations([
      'getProjectIdMutation', 
      'updatePageCount', 
      'changeWarehouseLoading', 
      'changeWarehouseUploadLoading',
      'updatePageIndex'
      ]),
    ...mapActions(['uploadImageFileAction', 'getImageListAction']),
    beforeUploadFile (file) {
      let size = file.size / 1024 / 1024
      let name = file.name
      let nameType = name.substring(name.lastIndexOf(".") + 1)
      if (nameType !== 'zip' && nameType !== 'rar') {
        this.$Message.error('只能上传zip或者rar类型的压缩文件')
        return
      }
      if (size > 30) {
        this.$Message.error('请上传30MB以下的文件')
        return
      }
      this.uploadImageFileAction(file).then(res => {
        if (res.data.result) {
          this.$Message.success('上传成功')
          this.getImageList()
          this.changeWarehouseUploadLoading()
        } else {
          this.$Message.error(res.data.message)
        }
      })
      return false;
    },
    getImageList () {
      this.getImageListAction().then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data)
          this.imageList = data.details
          this.updatePageCount(data.count)
          this.changeWarehouseLoading()
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    async handleChangePageIndex (pageIndex) {
      await this.updatePageIndex(pageIndex)
      this.getImageList()
    },
    handleImage (e) {
      console.log(e)
    }
  },
  computed: mapState(['warehouse'])
}
</script>

<style scoped lang="less">
.ware-container {
  position: relative;
  height: 100%;
  header {
    
  }
  main {
    position: absolute;
    top: 130px;
    bottom: 50px;
    width: 100%;
    ul {
      height: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      li {
        position: relative;
        width: 19%;
        background:rgb(230, 224, 224); 
        list-style: none;
        margin: 0px 1% 1% 0px;
        border: 1px solid #ccc;
        overflow: hidden;
        &:hover>section{
          display: block;
        }
        section {
          position: absolute;
          bottom: 0;
          background: rgba(0, 0 ,0 ,0.3);
          display: none;
          width: 100%;
          p {
            margin-left: 10px;
            height: 25px;
            line-height: 25px;
            font-size: 14px;
            font-weight: 520;
            color: #fff;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            text-shadow: 1px 1px 1px #000; 
          }
        }
        img {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
        }
      }
    }
  }
  footer {
    position: absolute;
    bottom: 0px;
    width: 100%;
  }
}
</style>
