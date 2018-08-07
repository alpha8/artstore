export default {
  props: {
    scroller: {}
  },
  data() {
    return {
      hasScroll: false
    };
  },
  mounted () {
    this.$bindScroll();
  },
  activated() {
    this.$bindScroll();
  },
  methods: {
    $bindScroll () {
      if (!this.hasScroll) {
        const scroller = this.scroller || window;
        scroller.addEventListener('scroll', this._handleScroll);
      }
    },
    $unbindScroll (scroller) {
      if (this.hasScroll) {
        scroller = scroller || this.scroller || window;
        scroller.removeEventListener('scroll', this._handleScroll);
        this.hasScroll = false;
      }
    },
    _handleScroll(e) {
      if (this.onScroll) {
        this.onScroll();
      }
      this.hasScroll = true;
    }
  },
  beforeDestroy () {
    this.$unbindScroll();
  },
  deactivated() {
    this.$unbindScroll();
  },
  watch: {
    scroller (scroller, oldScroller) {
      if (scroller === oldScroller) return;
      this.$unbindScroll(oldScroller);
      this.$bindScroll(scroller);
    }
  }
};
