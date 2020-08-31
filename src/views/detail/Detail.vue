<template>
  <div id="detail">
    <detail-nav-bar></detail-nav-bar>
    <detail-swiper :top-images="topImages"></detail-swiper>
  </div>
</template>

<script>
    import DetailNavBar from "./childComps/DetailNavBar";
    import DetailSwiper from "./childComps/DetailSwiper";

    import {getDetail} from 'network/detail';

    export default {
        name: "Detail",
        data(){
            return {
                iid: null,
                topImages: [],
            }
        },
        components: {
            DetailNavBar,
            DetailSwiper
        },
        created() {
            //1.保存传入的iid
            this.iid = this.$route.params.iid
            //2.根据iid请求详情数据
            getDetail(this.iid).then(res => {
                console.log(res)
                //1.获取顶部图片的轮播数据
                const data = res.result;
                this.topImages = data.itemInfo.topImages;
            })
        }
    }
</script>

<style scoped>

</style>
