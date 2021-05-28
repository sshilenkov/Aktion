export default class Header {
    constructor(root) {
        this.header = $(root);
        const hamburger = root.getElementsByClassName('hamburger')[0];
        
        this.toggleBurger = this.toggleBurger.bind(this);
        this.handleFixedState();

        hamburger.addEventListener('click', this.toggleBurger, false);
    }

    toggleBurger (event) {
        const body = document.getElementsByTagName('body')[0];
        const nav = document.getElementsByClassName('header__nav')[0];
        
        if (this.header.hasClass('header--main')) {
            this.header.toggleClass('header--open-hamburger');
        }
        
        event.currentTarget.classList.toggle('is-active');
        body.classList.toggle('fixed');
        nav.classList.toggle('header__nav--fixed');
    }

    handleFixedState () {
        const DEFAULT_OFFSET_TOP = 200;
        const $window = $(window);
        const $intro =  $('.section.section--intro');
        const $header = $('.header--main');
        const offsetTop = $intro.length ? $intro.offset().top + $intro.outerHeight() - this.header.outerHeight() : DEFAULT_OFFSET_TOP;

        const onScroll = () => {
            let currentScroll = $window.scrollTop();

            if (currentScroll > offsetTop) {
                this.header.addClass('header--fixed');    
            } else {
                this.header.removeClass('header--fixed');
            }
        };

        $window.on('scroll', onScroll);
    }
}