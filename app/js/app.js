// // Import jQuery module (npm i jquery)
// import $ from 'jquery'
// window.jQuery = $
// window.$ = $

// // Import vendor jQuery plugin example (not module)
// require('~/app/libs/mmenu/dist/mmenu.js')

import Header from './header/header';
import Footer from './footer/footer';
import Home from './home/home';
import Career from './career/career';
import Contacts from './contacts/contacts';
import News from './news/news';
import History from './history/history';
import Company from './company/company';

document.addEventListener('DOMContentLoaded', () => {

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

	const footer = document.querySelector('footer.footer');
	footer && new Footer(footer);
	
})
