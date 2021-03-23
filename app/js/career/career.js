import Parallax from 'parallax-js';
import Tabby from 'tabbyjs';
import { debounce } from 'debounce';

export default class Career {
    constructor(root) {
        this.root = root;

        this.addClasses();
        this.initParallax();
        this.calcConditionsImgHeight();
        this.initTabs();
        this.initVacancies();
    }

    addClasses() {
        const photoesList = this.root.getElementsByClassName('people__holder');
        
        for (let i = 0; i < photoesList.length; i++) {
            photoesList[i].classList.add(`people__holder--${i + 1}`);
        }
    }

    initParallax() {
        const scene = this.root.getElementsByClassName('section__scene')[0];
        const parallaxInstance = new Parallax(scene, {
            relativeInput: true,
            hoverOnly: true,
            pointerEvents: true,
            frictionX: 0.035,
            frictionY: 0.035,
        });
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

        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener('click', () => {
                for (let j = 0; j < videos.length; j++) {
                    videos[j].pause();
                }
            });
        }
    }

    initVacancies() {
        const about = this.root.querySelector('.vacancies__about');
        const backward = this.root.querySelector('.vacancies__backward');
        const content = this.root.querySelector('.vacancies__content');
        const directions = content.querySelector('.vacancies__directions');
        const vacanciesLists = directions.getElementsByClassName('vacancies__list');
        
        // Обрабатываем клик "Назад"
        backward.addEventListener('click', () => {
            this.listCopy.innerHTML = '';
            directions.classList.remove('hidden');
            about.classList.remove('hidden');
            backward.classList.remove('show');
        });
        
        for (let i = 0; i < vacanciesLists.length; i++) {
            const currentList = vacanciesLists[i];

            // Считаем и выводим количество вакансий для каждого направления
            const counter = currentList.querySelector('.vacancies__counter');
            const items = currentList.querySelectorAll('li');
            if (counter) {
                counter.innerHTML = (items.length - 1);
            }
            
            // Обрабатываем клик по направлению
            currentList.addEventListener('click', () => {
                this.listCopy = currentList.cloneNode(true);
                directions.classList.add('hidden');
                content.appendChild(this.listCopy);
                this.listCopy.classList.add('vacancies__list--full');
                about.classList.add('hidden');
                backward.classList.add('show');
            });

        }
    }
}