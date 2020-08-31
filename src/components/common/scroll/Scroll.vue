<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
    export default {
        name: "Scroll",
        props: {
          probeType: {
              type: Number,
              default: 0
          },
           pullUpLoad:{
              type: Boolean,
               default: false
           }
        },
        data() {
            return {
                scroll: null
            }
        },
        mounted() {
            //1.创建BScroll对象
          this.scroll = new BScroll(this.$refs.wrapper,{
              click: true,
              probeType: this.probeType,
              pullUpLoad: this.pullUpLoad
          })


            //2.监听滚动的位置
            if(this.probeType == 2 || this.probeType == 3){
                this.scroll.on('scroll',(postion) => {
                    // console.log(postion);
                    this.$emit('scroll',postion)
                })
            }

            //3.监听上拉事件
            if(this.pullUpLoad) {
                this.scroll.on('pullingUp', () => {
                    this.$emit('pullingUp')
                    // console.log('上拉加载更多')
                })
            }
        },
        methods: {
          scrollTo(x, y, time = 300) {
              this.scroll && this.scroll.scrollTo(x, y ,time)
          },
            //完成上拉加载
          finishPullUp() {
              this.scroll.finishPullUp()
          },
           refresh() {
              this.scroll && this.scroll.refresh()
               // console.log('------');
           },
           getScrollY() {
              return this.scroll ? this.scroll.y : 0
          }
        },
        components: {
            BScroll
        }
    }
</script>

<style scoped>

</style>
