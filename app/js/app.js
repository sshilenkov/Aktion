import $ from 'jquery'
window.jQuery = $
window.$ = $

// // Import vendor jQuery plugin example (not module)
// require('~/app/libs/mmenu/dist/mmenu.js')

import initBlocks from './blocks';
import { handleAnimationContainer } from './helpers';
import Header from './header/header';
import Footer from './footer/footer';
import Home from './home/home';
import Career from './career/career';
import Contacts from './contacts/contacts';
import News from './news/news';
import History from './history/history';
import Company from './company/company';
import Management from './management/management';
import Authors from './authors';
import Innovations from './innovations';

document.addEventListener('DOMContentLoaded', () => {
	initBlocks();

	const $container = $('.container');
	$container.length && handleAnimationContainer($container);

	const header = document.querySelector('header.header');
	header && new Header(header);

	const home = document.querySelector('main.home');
	home && new Home(home);

	const career = document.querySelector('main.career');
	career && new Career(career);

	const contacts = document.querySelector('main.contacts-page');
	contacts && new Contacts(contacts);

	const news = document.querySelector('main.news-page');
	news && new News(news);

	const history = document.querySelector('main.history');
	history && new History(history);

	const company = document.querySelector('main.company');
	company && new Company(company);

	const management = document.querySelector('main.management');
	management && new Management(management);

	const footer = document.querySelector('footer.footer');
	footer && new Footer(footer);

	const authors = document.querySelector('.authors');
	authors && new Authors(authors);

	const innovations = document.querySelector('.innovations');
	innovations && new Innovations(innovations);
})
