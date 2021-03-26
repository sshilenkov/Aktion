class Contacts {
    constructor(root) {
        this.root = root;

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

export default Contacts;