import Swiper, { Mousewheel, Pagination, Autoplay, EffectFade } from 'swiper';

class History {
    constructor(root) {
        this.root = root;
        this.animationDuration = 3000;
        this.isPaused = false;

        this.bindAutoplayStart = this.autoplayStart.bind(this);
        this.initPlayPauseButton();
        this.initHistory();
    }

    initHistory() {
        const swiperContainerMain = this.root.querySelector('.main-slider');
        const slides = this.root.querySelectorAll('.main-slider__slide');
        const pagination = this.root.querySelector('.history__years');
        this.title = this.root.querySelector('.history__title');
        const titleYear = this.title.querySelector('h3');

        Swiper.use([Mousewheel, Pagination, Autoplay, EffectFade]);

        this.swiperMain = new Swiper(swiperContainerMain, {
            mousewheel: true,
            initialSlide: slides.length,
            direction: 'vertical',
            pagination: {
                el: pagination,
                dynamicBullets: true,
                clickable: true,
                dynamicMainBullets: 2,
                renderBullet: function (index, className) {
                    const years = [];
                    slides.forEach(function(item, i) {
                        years.push(item.getAttribute('data-year'));
                    });
                    return `<span class="${className} history__year">${years[index]}</span>`;
                },
            },
            on: {
                beforeInit: () => {
                    slides.forEach(item => {
                        const nestedSlider = item.querySelector('.second-slider');

                        const nestedSwiper = new Swiper(nestedSlider, {
                            mousewheel: {
                                invert: true,
                            },
                            nested: true,
                            allowTouchMove: false,
                            effect: 'fade',
                            fadeEffect: {
                                crossFade: true
                            },
                        });

                        this.calcProgressItems(nestedSlider);
                    });
                },
                paginationUpdate: () => {
                    const pagElems = this.root.querySelectorAll('.history__year');
                    const active = this.root.querySelector('.swiper-pagination-bullet-active');
                    const prevEl = active.previousSibling;
                    const prePrevEl = prevEl ? prevEl.previousSibling : null;
                    const nextEl = active.nextSibling;
                    const afterNextEl = nextEl ? nextEl.nextSibling : null;

                    pagElems.forEach(item => (item.style.opacity = 0.15))
                    prevEl && (prevEl.style.opacity = 0.75);
                    prePrevEl && (prePrevEl.style.opacity = 0.35);
                    nextEl && (nextEl.style.opacity = 0.75);
                    afterNextEl && (afterNextEl.style.opacity = 0.35);
                },
                slideChangeTransitionStart:  (swiper) => {
                    const nextActiveSlide = swiper.slides[swiper.activeIndex];
                    
                    if (nextActiveSlide) {
                        const secondSlider = nextActiveSlide.querySelector('.second-slider');
                        const secondSliderSlides = secondSlider && secondSlider.querySelectorAll('.second-slider__slide');
                        const progress = nextActiveSlide.querySelector('.second-slider__progress');
    
                        if (secondSliderSlides && secondSliderSlides.length) {
                            secondSliderSlides.forEach(item => {
                                this.restartAnimation(item);
                            });
                            
                            this.restartAnimation(progress);
                            this.restartAnimation(this.title);
                        }

                        // change year in title for main slides
                        const currentYear = nextActiveSlide.getAttribute('data-year');
                        titleYear.innerHTML = currentYear;
                    }
                },
                slideChange: (swiper) => {
                    const activeSlide = swiper.slides[swiper.activeIndex];
                    const nestedSlider = activeSlide.querySelector('.swiper-container');
                    const firstNestedSlide = nestedSlider ? nestedSlider.querySelector('.second-slider__slide') : null;
                    const prevSlide = swiper.slides[swiper.previousIndex];
                    const prevNestedSlider = prevSlide.querySelector('.swiper-container');

                    this.stopPreviousNestedAutoplay(prevNestedSlider);
                    if (!this.isPaused) {
                        this.waitYearAnimationEnd(firstNestedSlide);
                    }
                }
            }
        });
    }

    initPlayPauseButton() {
        const button = this.root.querySelector('.history__play');
        const nestedSliders = this.root.querySelectorAll('.second-slider');

        nestedSliders.forEach((slider) => {
            const firstSlide = slider.querySelector('.second-slider__slide');

            firstSlide.addEventListener('animationstart', () => {
                firstSlide.dataset.animationRunning = true;
            }, false);
            firstSlide.addEventListener('animationend', () => {
                firstSlide.dataset.animationRunning = false;
            }, false);
        });

        button.addEventListener('click', () => {
            const activeYear = this.root.querySelector('.main-slider__slide.swiper-slide-active');
            const nestedSlider = activeYear.querySelector('.second-slider');
            const firstSlide = nestedSlider.querySelector('.second-slider__slide');
            const isYearAnimationRunning = firstSlide.dataset.animationRunning == 'true' ? true : false;
            const progressItems = nestedSlider.querySelectorAll('.second-slider__item');

            button.classList.toggle('paused');
            
            if (!isYearAnimationRunning && !this.isPaused) {
                this.stopAutoplay(nestedSlider);
                progressItems[nestedSlider.swiper.activeIndex].classList.remove('second-slider__item--active')
            } else if (!isYearAnimationRunning && this.isPaused) {
                this.autoplayStart(nestedSlider);
            } else if (isYearAnimationRunning && !this.isPaused) {
                this.removeYearAnimationEvent(firstSlide);
            } else if (isYearAnimationRunning && this.isPaused) {
                this.waitYearAnimationEnd(firstSlide);
            }

            this.isPaused = !this.isPaused;
        });
    }

    restartAnimation(node) {
        // restart CSS animations
        node.classList.remove('js-animation-start');
        void node.offsetWidth; // -> triggering reflow /* The actual magic */
        node.classList.add('js-animation-start');
    }
    
    waitYearAnimationEnd(firstSlide) {
        if (firstSlide) {
            const content = firstSlide.querySelector('.history__content');

            firstSlide.addEventListener('animationend', this.bindAutoplayStart, {once: true});
            this.title.addEventListener('animationend', () => {
                content && content.classList.add('js-content-animation');
            }, {once: true});
        }
    }

    removeYearAnimationEvent(firstSlide) {
        if (firstSlide) {
            firstSlide.removeEventListener('animationend', this.bindAutoplayStart, false);
        }
    }

    autoplayStart(param) { // param can be event or DOM-node
        const swiperNode = param.path ? param.path[2] : param; // get nested swiper node from event/node
        const swiper = swiperNode.swiper; // get swiper from node
        if (swiperNode && swiper) {
            swiper.params.autoplay.delay = this.animationDuration;
            swiper.params.autoplay.disableOnInteraction = false;
            this.nestedSliderAnimations(swiperNode);
            swiper.autoplay.start();
            swiper.on('toEdge', () =>{
                if (swiper.activeIndex == (swiper.slides.length - 1)) {
                    swiper.off('slideChangeTransitionStart');
                    swiper.once('slideChangeTransitionStart', () => {
                        this.swiperMain.slidePrev();
                        swiper.autoplay.stop();
                        swiper.off('toEdge');
                        swiper.off('slideChangeTransitionStart');
                    });
                }
            });
        }
    }

    stopAutoplay(swiperNode) {
        if (swiperNode && swiperNode.swiper) {
            swiperNode.swiper.autoplay.stop();
            swiperNode.swiper.off('toEdge');
            swiperNode.swiper.off('slideChangeTransitionStart');
        }
    }

    stopPreviousNestedAutoplay(swiperNode) {
        this.stopAutoplay(swiperNode);
    }

    calcProgressItems(swiperNode) {
        if (swiperNode) {
            const items = swiperNode.querySelectorAll('.second-slider__slide');
            const progress = swiperNode.querySelector('.second-slider__progress');

            items.forEach((item, i) => {
                if (progress) {
                    const styles = `left: ${(100 / items.length) * i}%;`;
                    const progressItem = document.createElement('span');
                    progressItem.classList.add('second-slider__item');
                    progressItem.style.cssText = styles;
                    progress.appendChild(progressItem);
                }
            });
        }
    }

    nestedSliderAnimations(swiperNode) {
        const slides = swiperNode.querySelectorAll('.second-slider__slide');
        const progressItems = swiperNode.querySelectorAll('.second-slider__item');
        
        swiperNode.swiper.on('autoplayStart', () => {
            progressItems[swiperNode.swiper.activeIndex].classList.add('second-slider__item--active');
            this.animate({
                duration: this.animationDuration,
                timing: function linear(timeFraction) {
                    return timeFraction;
                },
                draw: function(progress) {
                    progressItems[swiperNode.swiper.activeIndex].style.width = progress * (100 / progressItems.length) + '%';
                }
            });
        });

        swiperNode.swiper.on('slideChange', () => {
            const activeIndex = swiperNode.swiper.activeIndex;
            const currentItem = progressItems[activeIndex];
            
            slides.forEach((slide, idx) => {
                const content = slide.querySelector('.history__content');

                content.classList.remove('js-content-animation');
                content.style.transitionDelay = '0.3s'
                
                if (idx === activeIndex) {
                    content.classList.add('js-content-animation');
                }
            })

            progressItems.forEach((elem, indx) => {
                if (indx >= activeIndex) {
                    elem.classList.remove('second-slider__item--active');
                }
                
                if (indx < activeIndex) {
                    elem.classList.add('second-slider__item--active');
                    elem.style.width = (100 / progressItems.length) + '%';
                }
            });
            
            if (!this.isPaused) {
                currentItem.classList.add('second-slider__item--active');
                this.animate({
                    duration: this.animationDuration,
                    timing: function linear(timeFraction) {
                        return timeFraction;
                    },
                    draw: function(progress) {
                        currentItem.style.width = progress * (100 / progressItems.length) + '%';
                    }
                });
            }
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

export default History;