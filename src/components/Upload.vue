<template>
  <div>
    <Upload
      :multiple="multiple"
      :format="['jpg','jpeg','png']"
      :before-upload="handleUpload"
      :max-size="1024"
      action="//jsonplaceholder.typicode.com/posts/"
    >
      <Button icon="ios-cloud-upload-outline">上传图片</Button>
    </Upload>
      <ul class="image-container">
        <li v-for="(item, index) in fileList" :key="index">
          <img :src="item" alt="">
          <div class="image-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(index)"></Icon>
            <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
          </div>
        </li>
      </ul>
    <Modal
      v-model="showImage"
      width="50%"
      title="查看大图"
      :footer-hide="true"
      >
        <img :src="fileList[activeImage]" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    multiple: Boolean
  },
  data() {
    return {
      fileList: [],
      loadingStatus: false,
      showImage: false,
      activeImage: 0
    };
  },
  methods: {
    handleUpload(file) {
      let self = this
      let size = file.size / 1024
      if (size > 1024) {
        self.$Message.error('请上传小于 1M 的图片')
        return 
      }
      if (self.fileList.length > 4) {
        self.$Message.error('最多只能上传 5 张图片')
        return 
      }
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        self.$Message.error('只能上传 jpg , png , jpeg 格式的图片')
        return
      }
      let reader = new FileReader();
      reader.onload = function(e) {
        self.fileList.push(e.target.result)
      };
      reader.readAsDataURL(file);
      return false;
    },
    handleRemove (index) {
      this.fileList.splice(index, 1)
    },
    handleView (index) {
      console.log(index)
      this.activeImage = index
      this.showImage = true
    }
  },
  watch: {
    'fileList': function(newValue) {
      this.$emit('getImageList', newValue)
    }
  }
};
</script>

<style scoped lang="less">
.image-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  height: 100px;
  li {
    position: relative;
    width: 80px;
    height: 80px;
    padding: 5px;
    margin: 5px;
    list-style: none;
    border: 1px dashed #ccc;
    border-radius: 2px;
    img {
      width: 100%;
      height: 100%;
    }
    .image-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    &:hover .image-cover{
        display: block;
    }
    .image-cover i{
      line-height: 100%;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      margin: 25px 5px;
    }
  }

}
</style>
