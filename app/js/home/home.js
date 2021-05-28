import Swiper, { Navigation } from 'swiper';
import { debounce } from 'debounce';
import animate from '../animate';

// Copy tabby.js to manually disable focus() on tab change.
// Need to correct autoplay tab change in second section.
import Tabby from './tabby.js';

export default class Home {
    constructor(root) {
        this.root = root;
        this.autoplay = true;
        this.animate = animate;

        this.initScroller();
        this.initSlider('.technologies');
        this.initSlider('.cooperation');
        this.initProducts();
        this.handleIntroCategory();

        this.initLax();
        
        this.bindTechnologiesContentHeight = this.technologiesContentHeight.bind(this);
        window.onload = () => {
            this.technologiesContentHeight();
        }
    }

    initScroller() {
        const scroller = this.root.querySelector('.section__scroll');

        scroller.addEventListener('click', () => {
            const target = this.root.querySelector('.section--achievements');
            const headerHeight = document.querySelector('.header').offsetHeight - 5;

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
    
    initSlider(className) {
        Swiper.use([Navigation]);
        
        const slider = new Swiper(className, {
            slidesPerView: 3,
            navigation: {
                nextEl: className + '__next',
                prevEl: className + '__prev',
            },
            breakpoints: {
                320: {
                    slidesPerView: 'auto',
                    spaceBetween: 17,
                },
                790: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                }
            }
        });
    }

    initProducts() {
        const products = this.root.querySelector('.products');
        const list = products.querySelector('.products__list');
        const items = list.querySelectorAll('.products__item a');
        const firstContentNode = document.getElementById('tab1');
        const progressNodes = products.querySelectorAll('.products__progress');
        const videoNodes = products.querySelectorAll('.products__video');
        this.tabs = new Tabby('.products__list');

        this.playVideo(firstContentNode);

        const startPlayVideo = (e) => {
            this.playVideo(e.detail.content);
        }

        // Autoplay mode tab change
        this.root.addEventListener('tabby', startPlayVideo, false);

        items.forEach((item, idx) => {
            // Manual mode tab change
            item.addEventListener('click', () => {
                this.autoplay = false;
                this.root.removeEventListener('tabby', startPlayVideo, false);

                for (let i = 0; i < items.length; i++) {
                    progressNodes[i].classList.add('manual');
                    videoNodes[i].pause();
                    videoNodes[i].currentTime = 0;
                }

                videoNodes[idx].play();
                videoNodes[idx].setAttribute('loop', 'loop');
                
                if (window.innerWidth < 641) {
                    $(list).animate({
                        scrollLeft: item.offsetLeft
                    }, 'slow');
                }
            }, false);
        });
    }

    technologiesContentHeight() {
        const items = this.root.querySelectorAll('.technologies__item');
        let maxHeight = 0;

        items.forEach((item) => {
            const content = item.querySelector('.technologies__content');
            content.style.height = 'unset';

            if (content.offsetHeight > maxHeight) {
                maxHeight = content.offsetHeight;
            }
        });
        items.forEach((item) => {
            const content = item.querySelector('.technologies__content');
            content.style.height = `${maxHeight}px`;
        });

        window.addEventListener('resize', debounce(this.bindTechnologiesContentHeight, 200));
    }

    playVideo(DOMnode) {
        const currentVideo = DOMnode.querySelector('.products__video');
        const progress = DOMnode.querySelector('.products__progress');
        if (currentVideo.readyState) {
            requestAnimationFrame(() => {
                progress.style.transitionDuration = currentVideo.duration + 's';
                progress.classList.add('autoplay');
            })
            
            currentVideo.play();
            currentVideo.addEventListener('ended', () => {
                    const currentTabNumber = +DOMnode.getAttribute('id').slice(-1);
                    const firstTab = '#tab1';
                    const nextTab = `#tab${currentTabNumber + 1}`;
                    progress.classList.remove('autoplay');
                    progress.style.transitionDuration = '0s';
                    
                    if (this.autoplay) {
                        currentTabNumber === 4 ? this.tabs.toggle(firstTab) : this.tabs.toggle(nextTab);
                    }
                }, {once: true});
        } else {
            setTimeout(() => this.playVideo(DOMnode), 500)
        }
    }

    initLax() {
        const intro = this.root.querySelector('.section--intro .container');
        const containers = this.root.querySelectorAll('.section:not(.section--intro) .container');
        const scroll = this.root.querySelector('.section__scroll');

        window.addEventListener('load', () => {
            intro.classList.add('container--animated');
            scroll.classList.add('section__scroll--visible');
            containers.forEach((container) => {
                if (container.getBoundingClientRect().top <= window.outerHeight - 200) {
                    container.classList.add('container--animated');
                }
            });
        });

        window.addEventListener('scroll', () => {
            containers.forEach((container) => {
                if (container.getBoundingClientRect().top <= window.outerHeight - 200) {
                    container.classList.add('container--animated');
                }
            });
        })
    }

    handleIntroCategory () {
        const $section = $(this.root).find('.section.section--intro');
        const $intro = $('.intro-category');
        const $button = $intro.find('.intro-category__all');
        
        $button.on('click', function () {
            const $parent = $(this).parent();
            const $hiddenBlocks = $parent.find('.intro-category__item:nth-child(n + 5)');

            if ($parent.hasClass('intro-category--all-visible')) {
                $hiddenBlocks.hide();
            } else {
                $hiddenBlocks.each((i, el) => $(el).fadeIn(i * 100));
            }

            $section.toggleClass('section--open-category');
            $parent.toggleClass('intro-category--all-visible');
        });
    }
}