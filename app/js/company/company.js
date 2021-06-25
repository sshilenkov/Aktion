import Swiper from 'swiper';
import animate from '../animate';
import { debounce } from 'debounce';

class Company {
    constructor(root) {
        this.root = root;

        this.initScroller();
        this.initAnchors();
        this.initCommunications();
        this.initOurProjectsCarousel();
    }

    initScroller() {
        const scroller = this.root.querySelector('.scroller');

        scroller.addEventListener('click', () => {
            const target = this.root.querySelector('.section--mission');
            const headerHeight = document.querySelector('.header').offsetHeight;
            const missionPadding = window.innerWidth > 790 ? 0 : 320;

            animate({
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

                animate({
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

    initCommunications() {
        const commTitles = this.root.querySelectorAll('h3.communication__title');

        commTitles.forEach((title) => {
            const $content = $(title).next('.communication__content');

            if ($content.length) {
                $content.attr('data-open-height', $content.height());
                $content.height(0);
            }

            $(title).on('click', () => {
                $content.toggleClass('open');

                if ($content.hasClass('open')) {
                    $content.height($content.attr('data-open-height'));
                } else {
                    $content.height(0);
                }
            });
        });

        window.addEventListener('resize', debounce(this.calcCommunicationsContentHeight.bind(this), 200));
    }

    calcCommunicationsContentHeight() {
        const commContent = this.root.querySelectorAll('.communication__content');

        commContent.forEach((content) => {
            const $content = $(content);
            $content.height('auto');
            $content.attr('data-open-height', $content.height());

            if (!$content.hasClass('open')) {
                $content.height(0);
            }
        });
    }

    initOurProjectsCarousel() {
        new Swiper('.js-our-projects', {
            slidesPerView: 1.14,
            spaceBetween: 16,
            breakpoints: {
                640: {
                    sliderPerView: 1.5,
                    spaceBetween: 18,
                },
                1500: {
                    slidesPerView: 1.2,
                    spaceBetween: 24,
                },
            }
        });
    }
}

export default Company;