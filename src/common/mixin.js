import {debounce} from "./utils";

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
