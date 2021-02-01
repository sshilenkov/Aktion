import Swiper, { Navigation } from 'swiper';

export default class Home {
    constructor(root) {
        this.initSlider('.technologies');
        this.initSlider('.cooperation');


        const obj = document.getElementsByClassName('results')[0];
        obj.onload = function() {
        	const objDoc = obj.contentDocument;
        	const svg = objDoc.getElementsByTagName('svg')[0];
        	svg.removeAttribute('width');
            svg.removeAttribute('height');
            svg.setAttribute('preserveAspectRatio', 'none');
            // svg.setAttribute('viewBox', '0 0 100 100');
        }
    }

    initSlider(className) {
        Swiper.use([Navigation]);

        const slider = new Swiper(className, {
            slidesPerView: 3,
            spaceBetween: 24,
            navigation: {
                nextEl: className + '__next',
                prevEl: className + '__prev',
            },
        });
    }
}