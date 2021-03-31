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

        // this.directionsToggler();

        this.initLax();
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
                    // list.scrollLeft = item.offsetLeft;
                    list.scroll({
                        top: 0,
                        left: item.offsetLeft,
                        behavior: 'smooth'
                    })
                }
            }, false);
        });
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
}