import animate from '../animate';

class Contacts {
    constructor(root) {
        this.root = root;

        this.animate = animate;
        this.initScroller();
    }

    initScroller() {
        const scroller = document.querySelector('.scroller');

        scroller.addEventListener('click', () => {
            const target = document.getElementById('ymap');
            const headerHeight = document.querySelector('.header').offsetHeight;

            this.animate({
                duration: 1000,
                timing: (linear) => linear,
                draw(progress) {
                    const targetTop = target.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({
                        top: window.scrollY + progress * (targetTop - window.scrollY - headerHeight)
                    });
                }
            })
        });
    }
}

export default Contacts;