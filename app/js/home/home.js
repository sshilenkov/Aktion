import Swiper, { Navigation } from 'swiper';
import { debounce } from 'debounce';
import Lax from 'lax.js';

export default class Home {
    constructor(root) {
        this.root = root;

        this.initSlider('.technologies');
        this.initSlider('.cooperation');

        this.directionsToggler();

        this.initLax();

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

    directionsToggler() {
        const directionsBlock = this.root.getElementsByClassName('directions')[0];
        const toggler = this.root.getElementsByClassName('section__toggler')[0];
        const directionsList = directionsBlock.getElementsByClassName('directions__item');
        
        let nativeHeight;
        function resize() {
            if (window.innerWidth < 791) {
                if (directionsList && directionsList.length && directionsList.length > 8) {
                    !nativeHeight && (nativeHeight = directionsBlock.offsetHeight); // определяем высоту блока один раз, пока его высота полная
                    let rolledHeight = directionsList[7].offsetTop;
                    
                    directionsBlock.style.cssText = `height: ${rolledHeight}px;`;
                    toggler.style.cssText = 'display: block;';
                    toggler.onclick = () => {
                        if (directionsBlock.style.height == `${rolledHeight}px`) {
                            directionsBlock.style.cssText = `height: ${nativeHeight}px`;
                            toggler.textContent = 'Свернуть';
                        } else if (directionsBlock.style.height == `${nativeHeight}px`) {
                            directionsBlock.style.cssText = `height: ${rolledHeight}px`;
                            toggler.textContent = 'Показать все';
                        }
                    }
                }
            } else {
                directionsBlock.style.cssText = `height: unset;`;
                toggler.style.cssText = 'display: none;';
            }
        }

        window.onload = resize;
        window.addEventListener('resize', debounce(resize, 200));
    }
}