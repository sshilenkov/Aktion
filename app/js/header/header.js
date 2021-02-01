export default class Header {
    constructor(root) {
        const hamburger = root.getElementsByClassName('hamburger')[0];
        hamburger.addEventListener('click', this.toggleBurger, false);
    }

    toggleBurger() {
        const body = document.getElementsByTagName('body')[0];
        const nav = document.getElementsByClassName('header__nav')[0];

        this.classList.toggle('is-active');
        body.classList.toggle('fixed');
        nav.classList.toggle('header__nav--fixed');
    }
}