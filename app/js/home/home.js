import Swiper, { Navigation } from 'swiper';
import { debounce } from 'debounce';
import Lax from 'lax.js';

// Copy tabby.js to manually disable focus() on tab change.
// Need to correct autoplay tab change in second section.
import Tabby from './tabby.js';

export default class Home {
    constructor(root) {
        this.root = root;
        this.autoplay = true;

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

                if (window.innerWidth < 641) {
                    list.scroll({
                        top: 0,
                        left: item.offsetLeft,
                        behavior: 'smooth'
                    })
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
        Lax.init();
        Lax.addDriver('scrollY', () => window.scrollY);

        Lax.addElements('.section, .section__content', {
            scrollY: {
                opacity: [
                    ["elInY - 600", "elInY - 300"],
                    {
                        1144: [1, 1],
                        1400: [0, 1],
                    }
                ],
                translateY: [
                    ["elInY - 600", "elInY - 300"],
                    {
                        1144: [0, 0],
                        1400: [100, 0],
                    }
                ]
            }
        });
    }

    handleIntroCategory () {
        const $root = $('.intro-category');
        const $button = $root.find('.intro-category__all');

        $button.on('click', function () {
            const $parent = $(this).parent();
            const $hiddenBlocks = $parent.find('.intro-category__item:nth-child(n + 5)');

            if ($parent.hasClass('intro-category--all-visible')) {
                $hiddenBlocks.get().reverse().forEach((el, i) => $(el).fadeOut(i * 100));
            } else {
                $hiddenBlocks.each((i, el) => $(el).fadeIn(i * 100));
            }

            $(this).parent().toggleClass('intro-category--all-visible');
        });
    }
}