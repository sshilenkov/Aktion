export const handleButtonDown = ($button) => {
  $button.on('click', (event) => {
    const $this = $(event.target);
    const offset = $($this.attr('href')).offset().top;
    const headerHeight = $('.header').outerHeight();

    $('html, body').animate({
      scrollTop:  offset - headerHeight,
    }, 1000);
  })
};
