import Parallax from 'parallax-js';
import { gsap } from 'gsap';
import Tabby from 'tabbyjs';
import { debounce } from 'debounce';
import animate from '../animate';

export default class Career {
    constructor(root) {
        this.root = root;
        this.currentAnimationNumber = 0;

        this.addClasses();
        this.initParallax();
        this.vacanciesAnchor();
        // this.calcConditionsImgHeight();
        this.initTabs();
        this.initVacancies();

        this.bindParallax = this.initParallax.bind(this);

        window.addEventListener('resize', debounce(this.bindParallax, 200));
    }

    addClasses() {
        const photoesList = this.root.getElementsByClassName('people__holder');
        
        for (let i = 0; i < photoesList.length; i++) {
            photoesList[i].classList.add(`people__holder--${i + 1}`);
        }
    }

    initParallax() {
        // const scene = this.root.getElementsByClassName('section__scene')[0];
        // const parallaxInstance = new Parallax(scene, {
        //     relativeInput: true,
        //     hoverOnly: true,
        //     clipRelativeInput: true,
        //     pointerEvents: true,
        //     frictionX: 0.035,
        //     frictionY: 0.035,
        // });
        const holder = this.root.querySelector('.section__content');
        holder.removeEventListener('mousemove', this.handleMouseMove, false);

        if (window.innerWidth > 790) {
            holder.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
        }

        if (window.innerWidth < 791) {
            // возвращаем в центр
            gsap.to('.people', {
                x: 0,
                y: 0,
                duration: 2,
                ease: 'linear',
            });
        }
    }

    handleMouseMove(e) {
        this.currentAnimationNumber += 1;
        const people = document.querySelector('.people');
        const topElem = people.querySelector('.people__holder--18');
        const leftElem = people.querySelector('.people__holder--19');
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const centerX = windowWidth / 2;
        const centerY = windowHeight / 2;
        const coefficientX = (Math.abs(leftElem.offsetLeft) + windowWidth) / people.offsetWidth;
        const coefficientY = (Math.abs(topElem.offsetTop) + windowHeight) / people.offsetHeight;

        requestAnimationFrame(() => {
            gsap.to(people, {
                x: (centerX - e.pageX) * coefficientX,
                y: (centerY - e.pageY) * coefficientY,
                duration: 4,
                ease: 'linear',
                onComplete: (animationNumber) => {
                    // check if it last animation and return to center
                    if (animationNumber === this.currentAnimationNumber) {
                        gsap.to('.people', {
                            x: 0,
                            y: 0,
                            duration: 2,
                            ease: 'linear',
                        });
                    }
                },
                onCompleteParams: [this.currentAnimationNumber],
            });
        });
    }

    vacanciesAnchor() {
        const link = this.root.querySelector('.people__link');
        const vacancies = this.root.querySelector('.section--vacancies');
        const header = document.querySelector('.header');

        link.addEventListener('click', (e) => {
            e.preventDefault();

            animate({
                duration: 1000,
                timing: (linear) => linear,
                draw(progress) {
                    const targetTop = vacancies.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({
                        top: window.scrollY + progress * (targetTop - window.scrollY - header.offsetHeight)
                    });
                }
            })
        })
    }

    calcConditionsImgHeight() {
        const img = this.root.querySelector('.conditions__img--bottom img');
        const nextBlock = this.root.querySelector('.section--office');

        const resize = () => {
            const imgPos = img.getBoundingClientRect().top + pageYOffset;
            const nextBlockPos = nextBlock.getBoundingClientRect().top + pageYOffset;
            const offset = document.documentElement.clientWidth > 1144 ? 39 : 24;

            img.style.height = `${(nextBlockPos - imgPos) + offset}px`;
        }
        resize();
        window.addEventListener('resize', debounce(resize, 200));
    }

    initTabs() {
        const tabs = new Tabby('.our-work__tabs');
        const items = this.root.querySelectorAll('.our-work__item a');
        const videos = this.root.querySelectorAll('.our-work__video');
        
        if (videos.length) {
            window.addEventListener('scroll', () => {
                const headerHeight = document.querySelector('.header').offsetHeight;

                videos.forEach((video) => {
                    video.muted = true;
                    const bound = video.getBoundingClientRect();

                    // Если пользователь видит видео
                    if (window.innerHeight > bound.top && bound.bottom > headerHeight) {
                        video.play();
                    } else {
                        video.pause();
                    }
                })
            })
        }

        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener('click', () => {
                for (let j = 0; j < videos.length; j++) {
                    videos[j].pause();
                    // Play video in current tab
                    i == j && videos[j].play();
                }
            });
        }
    }

    initVacancies() {
        const vacanciesLists = this.root.querySelectorAll('.vacancies__list');
        
        for (let i = 0; i < vacanciesLists.length; i++) {
            const currentList = vacanciesLists[i];
            const department = currentList.querySelector('.vacancies__department');

            // Считаем и выводим количество вакансий для каждого направления
            const counter = currentList.querySelector('.vacancies__counter');
            const items = currentList.querySelectorAll('li');
            if (counter) {
                counter.innerHTML = (items.length - 1);
            }

            // Нужны для изменения высоты списка
            currentList.dataset.heightOpen = currentList.offsetHeight;
            currentList.dataset.heightClosed = department.offsetHeight;

            currentList.style.height = `${department.offsetHeight}px`;
            
            // Обрабатываем клик по направлению
            currentList.addEventListener('click', () => {
                // items.forEach((item) => {
                //     if (!item.classList.contains('vacancies__department')) {
                //         this.slideToggle(item);
                //     }
                // });
                currentList.classList.toggle('active');
                
                if (currentList.classList.contains('active')) {
                    currentList.style.height = `${currentList.dataset.heightOpen}px`;
                } else {
                    currentList.style.height = `${currentList.dataset.heightClosed}px`;
                }
            });
        }

        window.addEventListener('resize', debounce(this.calcVacanciesListHeight.bind(this), 200));
    }

    calcVacanciesListHeight() {
        const vacanciesLists = this.root.querySelectorAll('.vacancies__list');

        for (let i = 0; i < vacanciesLists.length; i++) {
            const currentList = vacanciesLists[i];
            const department = currentList.querySelector('.vacancies__department');
            
            currentList.style.height = 'auto';
            currentList.dataset.heightOpen = currentList.offsetHeight;
            currentList.dataset.heightClosed = department.offsetHeight;
            
            if (!currentList.classList.contains('active')) {
                currentList.style.height = `${currentList.dataset.heightClosed}px`;
            }
        }
    }

    slideUp(element, duration = 500) {

        return new Promise(function (resolve, reject) {

            element.style.height = element.offsetHeight + 'px';
            element.style.transitionProperty = `height, margin, padding`;
            element.style.transitionDuration = duration + 'ms';
            element.offsetHeight;
            element.style.overflow = 'hidden';
            element.style.height = 0;
            element.style.paddingTop = 0;
            element.style.paddingBottom = 0;
            element.style.marginTop = 0;
            element.style.marginBottom = 0;
            window.setTimeout(function () {
                element.style.display = 'none';
                element.style.removeProperty('height');
                element.style.removeProperty('padding-top');
                element.style.removeProperty('padding-bottom');
                element.style.removeProperty('margin-top');
                element.style.removeProperty('margin-bottom');
                element.style.removeProperty('overflow');
                element.style.removeProperty('transition-duration');
                element.style.removeProperty('transition-property');
                resolve(false);
            }, duration)
        })
    }

    slideDown(element, duration = 500) {

        return new Promise(function (resolve, reject) {

            element.style.removeProperty('display');
            let display = window.getComputedStyle(element).display;

            if (display === 'none') 
                display = 'block';

            element.style.display = display;
            let height = element.offsetHeight;
            element.style.overflow = 'hidden';
            element.style.height = 0;
            element.style.paddingTop = 0;
            element.style.paddingBottom = 0;
            element.style.marginTop = 0;
            element.style.marginBottom = 0;
            element.offsetHeight;
            element.style.transitionProperty = `height, margin, padding`;
            element.style.transitionDuration = duration + 'ms';
            element.style.height = height + 'px';
            element.style.removeProperty('padding-top');
            element.style.removeProperty('padding-bottom');
            element.style.removeProperty('margin-top');
            element.style.removeProperty('margin-bottom');
            window.setTimeout(function () {
                element.style.removeProperty('height');
                element.style.removeProperty('overflow');
                element.style.removeProperty('transition-duration');
                element.style.removeProperty('transition-property');
            }, duration)
        })
    }

    slideToggle(element, duration = 500) {

        if (window.getComputedStyle(element).display === 'none') {

            return this.slideDown(element, duration);

        } else {

            return this.slideUp(element, duration);
        }
    }
}