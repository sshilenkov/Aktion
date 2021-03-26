class Company {
    constructor(root) {
        this.root = root;

        this.initScroller();
        this.initAnchors();
    }

    initScroller() {
        const scroller = this.root.querySelector('.scroller');

        scroller.addEventListener('click', () => {
            const target = this.root.querySelector('.section--mission');
            const headerHeight = document.querySelector('.header').offsetHeight;
            const missionPadding = window.innerWidth > 790 ? 0 : 320;

            this.animate({
                duration: 700,
                timing: (linear) => linear,
                draw(progress) {
                    const targetTop = target.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({
                        top: window.scrollY + progress * (targetTop - window.scrollY - headerHeight + missionPadding)
                    });
                }
            })
        });
    }

    initAnchors() {
        const triggerItems = this.root.querySelectorAll('.knowledge__item');

        triggerItems.forEach((item) => {
            item.addEventListener('click', () => {
                const targetId = item.getAttribute('data-for');
                const target = document.getElementById(targetId);
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
        });
    }

    animate({timing, draw, duration}) {

        let start = performance.now();

        requestAnimationFrame(function animate(time) {
            // timeFraction изменяется от 0 до 1
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            // вычисление текущего состояния анимации
            let progress = timing(timeFraction);

            draw(progress); // отрисовать её

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }

        });
    }
}

export default Company;