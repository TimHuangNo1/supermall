import {debounce} from "./utils";
import BackTop from "../components/content/backTop/BackTop";
import {TOP_DISTANCE} from "./const";

/**
 * 抽取组件中的公共代码（混入）
 * 监听GoodsListItem中的图片是否加载完成
 * @type {{mounted(): void}}
 */
export const itemListener = {
  data() {
    return {
      itemListener: null,
      refresh: null
    }
  },
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 500);
    this.itemListener = () => {
      this.refresh()
    }

    this.$bus.$on('itemImgLoad', this.itemListener);
    // console.log('mounted混入操作')
  }
}

/**
 * 点击回到顶部的公共代码
 * @type {{components: {BackTop}, data(): {isShowBackTop: boolean}, methods: {backClick(): void}}}
 */
export const backTop = {
  components: {
    BackTop
  },
  data() {
    return {
      //是否显示backTop按钮
      isShowBackTop: false
    }
  },
  methods: {
    //监听组件的点击（click后native）
    backClick() {
      this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0, 1000);
    },
    showBackTop(postion) {
      this.isShowBackTop = -postion.y >TOP_DISTANCE;
    }
  }
}
