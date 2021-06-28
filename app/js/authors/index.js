 export default class Authors {
  constructor (root) {
    this.$root = $(root);
    this.$filters = this.$root.find('.authors__filter');

    this.handleFloatMenu();
    this.handleScrollFilter();
  }

  changePositionMenu (position) {
    this.$filters.map((index, filter) => {
      const $filter = $(filter);
      const pos = position ?? $filter.offset().left - $filter.find('.authors__others').width();

      if ($filter.find('.authors__others').length) {
        $filter.find('.authors__others').css('left', pos);
      }
    })
  }

  handleFloatMenu () {
    const breakpoint = window.matchMedia("(max-width: 1170px)");
    const fn = () => {
      if (breakpoint.matches) {
        this.changePositionMenu()
      } else {
        this.changePositionMenu(0)
      }
    }
    breakpoint.addListener(fn);
    fn();
  }

  handleScrollFilter () {
    this.$root.find('.authors__filters').on('scroll', () => {
      this.changePositionMenu();
    })
  }
}