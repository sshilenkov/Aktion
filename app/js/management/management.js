import Swiper from 'swiper';
import { debounce } from 'debounce';

class Management {
    constructor(root) {
        this.root = root;

        this.initSlider();
        this.initManagers();
    }

    initSlider() {
        const slider = new Swiper('.directors', {
            slidesPerView: 4,
            spaceBetween: 24,
            breakpoints: {
                320: {
                    slidesPerView: 'auto',
                    spaceBetween: 24,
                },
                640: {
                    slidesPerView: 4,
                    spaceBetween: 18,
                },
                791: {
                    spaceBetween: 24
                }
            }
        });
    }

    initManagers() {
        const title = this.root.querySelector('.section--managers .section__title');

        title.addEventListener('click', () => {
            $(title).siblings('.section__content').slideToggle();
            title.classList.toggle('section__title--open');
        });
    }
}

export default Management;