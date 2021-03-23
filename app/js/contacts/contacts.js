class Contacts {
    constructor(root) {
        this.root = root;

        this.initScroll();
    }

    initScroll() {
        const anchor = document.querySelector('.ymap-scroller');

        anchor.addEventListener('click', () => {
            anchor.scrollIntoView();
        });
    }
}

export default Contacts;