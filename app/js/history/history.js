import Swiper, { Mousewheel, Pagination, Autoplay, EffectFade } from 'swiper';
import animate from '../animate';

class History {
    constructor(root) {
        this.root = root;

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
            mousewheel: false,
            direction: 'vertical',
            pagination: {
                el: pagination,
                dynamicBullets: true,
                clickable: true,
                dynamicMainBullets: 2,
                renderBullet: function (index, className) { // years display
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
                        const nestedSlides = nestedSlider && nestedSlider.querySelectorAll('.second-slider__slide')

                        const nestedSwiper = new Swiper(nestedSlider, {
                            mousewheel: {
                                sensitivity: 0.5
                            },
                            nested: true,
                            effect: 'fade',
                            fadeEffect: {
                                crossFade: true
                            },
                            on: {
                                // slideChangeTransitionStart: () => nestedSwiper.mousewheel.disable(),
                                slideChangeTransitionEnd: (swiper) => {
                                    const slidesNumber = swiper.el.querySelectorAll('.swiper-slide').length;
                                    console.log('swiper length', slidesNumber, swiper.activeIndex)
                                    
                                    // Fix safari slide change (last nested slide was didn't display - on slide to last slide
                                    // year was changed at once and user didn't saw last slide)
                                    this.swiperMain.mousewheel.disable();
                                    if (swiper.activeIndex === 0 || slidesNumber === swiper.activeIndex + 1) {
                                        this.swiperMain.mousewheel.enable();
                                    }
                                },
                                reachEnd: () => {
                                    // this.swiperMain.mousewheel.enable()
                                }
                            }
                        });
                        
                        // add progress info
                        if (nestedSlides) {
                            nestedSlides.forEach((item, i) => {
                                const content = item.querySelector('.history__content');
                                
                                if (content) {
                                    const progress = content.querySelector('.history__progress');
                                    
                                    progress && (progress.innerHTML = `0${i + 1}/0${nestedSlides.length}`);
                                }
                            });
                        }

                        // animation for slide content
                        nestedSwiper.on('slideChange', () => {
                            const activeIndex = nestedSwiper.activeIndex;;
                            
                            nestedSlides.forEach((slide, idx) => {
                                const content = slide.querySelector('.history__content');
                
                                if (content) {
                                    content.classList.remove('js-content-animation');
                                    content.style.transitionDelay = '0.3s'
                                    
                                    if (idx === activeIndex) {
                                        content.classList.add('js-content-animation');
                                    }
                                }
                            });
                        });
                    });
                },
                afterInit: () => {
                    const firstMainSlide = this.root.querySelector('.main-slider__slide');
                    const nestedSliderSlides = firstMainSlide && firstMainSlide.querySelectorAll('.second-slider__slide');

                    
                    if (nestedSliderSlides && nestedSliderSlides.length) {
                        nestedSliderSlides.forEach(slide => {
                            this.restartAnimation(slide);
                        });
                        
                        this.restartAnimation(this.title);
                    }
                    
                    // change year in title for main slides
                    const currentYear = firstMainSlide.getAttribute('data-year');
                    titleYear.innerHTML = currentYear;

                    this.waitYearAnimationEnd(nestedSliderSlides[0]);
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
                        const nestedSlider = nextActiveSlide.querySelector('.second-slider');
                        const nestedSliderSlides = nestedSlider && nestedSlider.querySelectorAll('.second-slider__slide');
    
                        if (nestedSliderSlides && nestedSliderSlides.length) {
                            nestedSliderSlides.forEach(item => {
                                this.restartAnimation(item);
                            });
                            
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

                    if (prevNestedSlider) {
                        prevNestedSlider.swiper.slideTo(0, 500, false);

                        // remove text from first slide on animation
                        const content = prevNestedSlider.querySelector('.history__content');
                        content && content.classList.remove('js-content-animation');
                    }

                    this.waitYearAnimationEnd(firstNestedSlide);
                }
            }
        });
    }

    restartAnimation(node) {
        // fix slide display before animation start
        node.classList.remove('js-animation-start');

        // restart CSS animations
        node.classList.remove('js-animation-start');
        void node.offsetWidth; // -> triggering reflow /* The actual magic */
        node.classList.add('js-animation-start');
    }
    
    waitYearAnimationEnd(firstSlide) {
        if (firstSlide) {
            const content = firstSlide.querySelector('.history__content');

            this.title.addEventListener('animationend', () => {
                content && content.classList.add('js-content-animation');
            }, {once: true});
        }
    }
}

export default History;