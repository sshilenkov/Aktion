import './fullpage.scrollHorizontally.min.js';
import fullpage from 'fullpage.js/dist/fullpage.extensions.min';

import Swiper, { Mousewheel, Pagination, Autoplay, EffectFade } from 'swiper';

class History {
    constructor(root) {
        this.root = root;
        this.menu = this.root.querySelector('.history__menu');
        
        // init page
        this.init();
        
        // menu values
        this.visibleMenuItemsCount = 6;
        this.menuItemSize = 52;
        this.offset = this.menuItemSize * 2;
        this.menuItems = this.menu.querySelectorAll('li');

        this.initMenu();
    }

    init() {
        this.title = this.root.querySelector('.history__title');
        const titleYear = this.title.querySelector('h3');
        const years = this.root.querySelectorAll('.history__year');
        let naviArr = [];

        years.forEach((year, index) => {
            const yearVal = year.getAttribute('data-anchor');
            const slides = year.querySelectorAll('.history__event');

            // push years to array
            naviArr.push(yearVal);

            this.createMenuItems(yearVal, index);

            if (slides.length) {
                slides.forEach((item, i) => {
                    const content = item.querySelector('.history__content');
                    
                    if (content) {
                        const progress = content.querySelector('.history__progress');
                        
                        progress && (progress.innerHTML = `0${i + 1} / 0${slides.length}`);
                    }
                });
            }
        });

        const history = new fullpage('.history__body', {
            licenseKey: '585AABEF-A34F4858-B9D25A15-EBFB0DFC',
            scrollHorizontallyKey: '549A9BCA-78B44790-9A30769A-85C95E14',
            scrollHorizontally: true,
            sectionSelector: '.history__year',
            slideSelector: '.history__event',
            controlArrows: false,
            menu: '.history__menu',
            afterRender: () => {
                // change year in title for main slides
                const currentYear = this.root.querySelector('.history__year').getAttribute('data-anchor');
                titleYear.innerHTML = currentYear;
                
                // start title animation
                this.restartAnimation(this.title);
                
                // start event content animation after title animation end
                const firstEvent = this.root.querySelector('.history__event');
                fullpage_api.setAllowScrolling(false);
                this.waitYearAnimationEnd(firstEvent);
            },
            onLeave: (origin, destination) => {
                const originContents = origin.item.querySelectorAll('.history__content');
                const destinationItem = destination.item;
                const destinationEvents = destinationItem.querySelectorAll('.history__event');

                // remove content from events
                originContents.forEach((content) => {
                    content.classList.remove('js-content-animation');
                });

                // restart events animation after year change
                destinationEvents.forEach((event) => {
                    this.restartAnimation(event);
                });
                    
                // change year in title for main slides
                const currentYear = destinationItem.getAttribute('data-anchor');
                titleYear.innerHTML = currentYear;

                // restart title animation with new year inside
                this.restartAnimation(this.title);

                // restart content animation after title animation end
                fullpage_api.setAllowScrolling(false);
                this.waitYearAnimationEnd(destinationEvents[0]);

                // recalc years position
                this.recalcMenu(destination.index);
            },
            onSlideLeave: (section, origin, destination) => {
                const originContent = origin.item.querySelector('.history__content');
                const destcontent = destination.item.querySelector('.history__content');
                
                // manage content display on slide chage
                originContent.classList.remove('js-content-animation');
                destcontent.style.transitionDelay = '0.5s';
                destcontent.classList.add('js-content-animation');
            }
        })
    }

    createMenuItems(yearVal, index) {
        // create new menu item, link and textNode
        const menuItem = document.createElement('li');
        const insideLink = document.createElement('a');
        const textNode = document.createTextNode(yearVal);
        // modify link
        insideLink.href = `#${yearVal}`;
        insideLink.appendChild(textNode);
        // modify menu item
        menuItem.dataset.menuanchor = yearVal;
        index === 0 && menuItem.classList.add('active');
        menuItem.appendChild(insideLink);

        this.menu.appendChild(menuItem);
    }

    initMenu() {
        this.menu.style.height = `${this.visibleMenuItemsCount * this.menuItemSize}px`;
        this.menuItems.forEach((item) => {
            item.style.top = `${this.offset}px`;

            // change opacity for all elements
            item.style.opacity = 0.15;
        });

        this.changeYearsOpacity();
    }

    recalcMenu(activeYearIndex) {
        this.menuItems.forEach((item, index) => {
            item.style.top = `${this.offset - (activeYearIndex * this.menuItemSize)}px`;

            // change opacity for all elements
            item.style.opacity = 0.15;
        });

        this.changeYearsOpacity(activeYearIndex);
    }

    changeYearsOpacity(activeYearIndex) {
        // change opacity for every element relative to his position
        const active = Number.isInteger(activeYearIndex) ? this.menuItems[activeYearIndex] : this.root.querySelector('.history__menu > .active');
        const prevEl = active.previousSibling.nodeType == 1 ? active.previousSibling : null;
        const prePrevEl = prevEl && prevEl.previousSibling && prevEl.previousSibling.nodeType == 1 ? prevEl.previousSibling : null;
        const nextEl = active.nextSibling && active.nextSibling.nodeType == 1 ? active.nextSibling : null;
        const afterNextEl = nextEl && nextEl.nextSibling && nextEl.nextSibling.nodeType == 1 ? nextEl.nextSibling : null;

        // console.log('active', prePrevEl.nodeType)
        prevEl && (prevEl.style.opacity = 0.75);
        prePrevEl && (prePrevEl.style.opacity = 0.35);
        nextEl && (nextEl.style.opacity = 0.75);
        afterNextEl && (afterNextEl.style.opacity = 0.35);
    }

    restartAnimation(node) {
        // restart CSS animations
        node.classList.remove('js-animation-start');
        void node.offsetWidth; // -> triggering reflow /* The actual magic */
        node.classList.add('js-animation-start');
    }
    
    waitYearAnimationEnd(event) {
        if (event) {
            const content = event.querySelector('.history__content');

            this.title.addEventListener('animationend', () => {
                content && content.classList.add('js-content-animation');
                fullpage_api.setAllowScrolling(true);
            }, {once: true});
        }
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

                        // const nestedSwiper = new Swiper(nestedSlider, {
                        //     // mousewheel: true,
                        //     nested: true,
                        //     effect: 'fade',
                        //     fadeEffect: {
                        //         crossFade: true
                        //     },
                        //     on: {
                        //         slideChangeTransitionStart: (swiper) => {
                        //             swiper.mousewheel.disable();
                        //             this.timeoutID && clearTimeout(this.timeoutID);
                        //             this.swiperMain.mousewheel.disable();
                        //             this.nestedSlider = swiper;
                                    
                        //             window.removeEventListener('wheel', this.slideChange, false);
                        //         },
                        //         slideChangeTransitionEnd: (swiper) => {
                        //             window.addEventListener('wheel', this.slideChange.bind(this), false);

                        //             if (swiper.activeIndex === 0) {
                        //                 this.swiperMain.mousewheel.enable();
                        //             }
                        //             // const slidesNumber = swiper.el.querySelectorAll('.swiper-slide').length;
                                    
                        //             // this.timeoutID = setTimeout(() => {
                        //             //     swiper.mousewheel.enable();

                        //             //     // Fix safari slide change (last nested slide was didn't display - on slide to last slide
                        //             //     // year was changed at once and user didn't saw last slide)
                        //             //     if (swiper.activeIndex === 0 || slidesNumber === swiper.activeIndex + 1) {
                        //             //         this.swiperMain.mousewheel.enable();
                        //             //     }
                        //             // }, 300);
                        //         }
                        //     }
                        // });
                        
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
                        // nestedSwiper.on('slideChange', () => {
                        //     const activeIndex = nestedSwiper.activeIndex;;
                            
                        //     nestedSlides.forEach((slide, idx) => {
                        //         const content = slide.querySelector('.history__content');
                
                        //         if (content) {
                        //             content.classList.remove('js-content-animation');
                        //             content.style.transitionDelay = '0.3s'
                                    
                        //             if (idx === activeIndex) {
                        //                 content.classList.add('js-content-animation');
                        //             }
                        //         }
                        //     });
                        // });
                    });
                },
                afterInit: () => {
                    const firstMainSlide = this.root.querySelector('.main-slider__slide');
                    const nestedSlider = firstMainSlide.querySelector('.second-slider');
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

                    this.waitYearAnimationEnd(nestedSlider);
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
                    this.swiperMain.mousewheel.disable();
                    const nextActiveSlide = swiper.slides[swiper.activeIndex];
                    
                    if (nextActiveSlide) {
                        const nestedSlider = nextActiveSlide.querySelector('.second-slider');
                        const nestedSliderSlides = nestedSlider && nestedSlider.querySelectorAll('.second-slider__slide');
                        
                        // nestedSlider && nestedSlider.swiper.mousewheel.disable();

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
                    const nestedSlider = activeSlide.querySelector('.second-slider');
                    const prevSlide = swiper.slides[swiper.previousIndex];
                    const prevNestedSlider = prevSlide.querySelector('.second-slider');

                    if (prevNestedSlider) {
                        // prevNestedSlider.swiper.slideTo(0, 500, false);

                        // remove text from first slide on animation
                        const content = prevNestedSlider.querySelector('.history__content');
                        content && content.classList.remove('js-content-animation');
                    }

                    // nestedSlider && nestedSlider.swiper.mousewheel.disable();
                    this.waitYearAnimationEnd(nestedSlider);
                }
            }
        });
    }



    // slideChange() {
    //     this.timeoutID && clearTimeout(this.timeoutID);

    //     this.timeoutID = setTimeout(() => {
    //         const slidesNumber = this.nestedSlider.el.querySelectorAll('.swiper-slide').length;
    //         // this.nestedSlider.mousewheel.enable();

    //         // Fix safari slide change (last nested slide was didn't display - on slide to last slide
    //         // year was changed at once and user didn't saw last slide)
    //         if (slidesNumber === this.nestedSlider.activeIndex + 1) {
    //             this.swiperMain.mousewheel.enable();
    //         }
    //     }, 300);
    // }

    
}

export default History;