import Swiper, { Navigation } from 'swiper';
import { debounce } from 'debounce';
import lax from 'lax.js';

export default class Home {
    constructor(root) {
        this.initSlider('.technologies');
        this.initSlider('.cooperation');

        const directionsBlock = root.getElementsByClassName('directions')[0];
        const toggler = root.getElementsByClassName('section__toggler')[0];
        this.directionsToggler(directionsBlock, toggler);

        this.initLax(root);

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

    initLax(root) {
        lax.init();
        lax.addDriver('scrollY', () => window.scrollY);

        const sectionsList = root.getElementsByClassName('section');

        lax.addElements('.section, .section__content, .footer', {
            scrollY: {
                opacity: [
                    ["elInY - 600", "elInY - 300"],
                    [0, 1],
                ],
                translateY: [
                    ["elInY - 600", "elInY - 300"],
                    [100, 0],
                ]
            }

        })
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

    directionsToggler(directionsBlock, toggler) {
        const directionsList = directionsBlock.getElementsByClassName('directions__item');
        window.onresize = debounce(resize, 300);
        
        let nativeHeight;
        function resize() {
            if (window.innerWidth < 790) {
                if (directionsList && directionsList.length && directionsList.length > 8) {
                    !nativeHeight && (nativeHeight = directionsBlock.offsetHeight); // определяем высоту блока один раз, пока его высота полная
                    let rolledHeight = directionsList[7].offsetTop;
                    
                    directionsBlock.style.cssText = `height: ${rolledHeight}px;`;
                    toggler.style.cssText = 'display: block;';
                    toggler.onclick = () => {
                        if (directionsBlock.style.height == `${rolledHeight}px`) {
                            directionsBlock.style.cssText = `height: ${nativeHeight}px`;
                            this.textContent = 'Свернуть';
                        }
                        
                        if (directionsBlock.style.height == `${nativeHeight}px`) {
                            directionsBlock.style.cssText = `height: ${rolledHeight}px`;
                            this.textContent = 'Показать все';
                        }
                    }
                }
            } else {
                directionsBlock.style.cssText = `height: unset;`;
                toggler.style.cssText = 'display: none;';
            }
        }

        window.onload = resize;
    }
}