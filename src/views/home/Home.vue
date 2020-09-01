<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"></tab-control>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"/>
      <feature-view></feature-view>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
    import HomeSwiper from "./childComps/HomeSwiper";
    import RecommendView from "./childComps/RecommendView";
    import FeatureView from "./childComps/FeatureView";

    import NavBar from "../../components/common/navbar/NavBar";
    import TabControl from "../../components/content/tabControl/TabControl";
    import GoodsList from "../../components/content/goods/GoodsList";
    import Scroll from "../../components/common/scroll/Scroll";
    import BackTop from "../../components/content/backTop/BackTop";

    import {getHomeMultidata, getHomeGoods} from "../../network/home";
    import {debounce} from "../../common/utils";
    import {itemListener} from "../../common/mixin";

    export default {
        name: "Home",
        components: {
            NavBar,
            HomeSwiper,
            RecommendView,
            FeatureView,
            TabControl,
            GoodsList,
            Scroll,
            BackTop
        },
        mixins: [itemListener],
        data() {
            return {
                banners: [],
                recommends: [],
                goods: {
                    'pop': {page: 0, list: []},
                    'new': {page: 0, list: []},
                    'sell': {page: 0, list: []}
                },
                currentType: 'pop',
                isShowBackTop: false,
                tabOffsetTop: 0,
                isTabFixed: false,
                saveY: 0
            }
        },
        computed: {
            showGoods() {
                return this.goods[this.currentType].list
            }
        },
        created() {
            //1.请求多个数据
            this.getHomeMultidata()

            //2.请求商品数据
            this.getHomeGoods('pop')
            this.getHomeGoods('new')
            this.getHomeGoods('sell')

            // //3.监听item中图片加载完成
            // this.$bus.$on('itemImageLoad',() => {
            //     // console.log('--------');
            //     this.$refs.scroll.refresh();
            // })
        },
        destroyed() {
            console.log('destroyed');
        },
        activated() {
            //刷新一下，防止回到顶部
            this.$refs.scroll.refresh();
            // console.log('activated');
            this.$refs.scroll.scrollTo(0, this.saveY, 0)
        },
        deactivated() {
            // console.log('deactivated');
            //1.保持Y值
            this.saveY = this.$refs.scroll.getScrollY()

            //2.取消全局事件监听
            this.$bus.$off('itemImgLoad',this.itemListener)
        },
        mounted() {
            //防抖
            // const refresh = this.debounce(this.$refs.scroll.refresh,200)
            //使用混入函数mixin中的itemListener，注释以下方法
            // const refresh = debounce(this.$refs.scroll.refresh, 200)
            //
            // this.$bus.$on('itemImageLoad', () => {
            //     refresh()
            // })

            //获取tabControl的offsetTop
            //所有的组件都有一个属性：$el,用于获取组件中的元素
            //console.log(this.$refs.tabControl.$el.offsetTop);
            // this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;

        },
        methods: {
            /**
             *事件监听相关方法
             * **/
            //防抖动
            // debounce(func, delay) {
            //     let timer = null
            //
            //     return function (...args) {
            //         if(timer) clearTimeout(timer)
            //         timer = setTimeout(() => {
            //             func.apply(this, args)
            //         },delay)
            //     }
            // },
            tabClick(index) {
                switch (index) {
                    case 0:
                        this.currentType = 'pop'
                        break
                    case 1:
                        this.currentType = 'new'
                        break
                    case 2:
                        this.currentType = 'sell'
                        break
                }
                this.$refs.tabControl1.currentIndex = index;
                this.$refs.tabControl2.currentIndex = index;
            },

            backClick() {
                this.$refs.scroll.scrollTo(0, 0, 500)
                //console.log('111')
            },

            contentScroll(postion) {
                //1、判断backTop是否显示
                this.isShowBackTop = (-postion.y) > 1000;

                //2、判断tabControl是否吸顶
                this.isTabFixed = (-postion.y) > this.tabOffsetTop;
            },

            loadMore() {
                //直接调用加载函数
                // console.log('------')
                this.getHomeGoods(this.currentType)

                this.$refs.scroll.refresh()
            },

            swiperImageLoad() {
                //获取tabControl的offsetTop
                //所有组件都有一个属性$el：用于获取组件中的元素

                // console.log(this.$refs.tabControl.$el.offsetTop);
                this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
                // console.log('-----')
            },
            /**
             * 网络请求相关
             * **/
            getHomeMultidata() {
                getHomeMultidata().then(res => {
                    // console.log(res)
                    this.banners = res.data.banner.list;
                    this.recommends = res.data.recommend.list;
                })
            },
            getHomeGoods(type) {
                const page = this.goods[type].page + 1
                getHomeGoods(type, page).then(res => {
                    //获取前30页数据
                    this.goods[type].list.push(...res.data.list)
                    this.goods[type].page += 1

                    //结束加载
                    this.$refs.scroll.finishPullUp()
                })
            }
        }
    }
</script>

<style scoped>

</style>


<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  /*.tab-control {*/
  /*  !*position: sticky;*!*/
  /*  top: 44px;*/
  /*  z-index: 9;*/
  /*}*/
  .tab-control {
    position: relative;
    z-index: 9;
  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {

  }

  /*.content {*/
  /*height: calc(100% - 93px);*/
  /*overflow: hidden;*/
  /*margin-top: 44px;*/
  /*}*/
</style>

