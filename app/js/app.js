// // Import jQuery module (npm i jquery)
// import $ from 'jquery'
// window.jQuery = $
// window.$ = $

// // Import vendor jQuery plugin example (not module)
// require('~/app/libs/mmenu/dist/mmenu.js')

import Footer from './footer/footer';
import Home from './home/home';

document.addEventListener('DOMContentLoaded', () => {

	const home = document.getElementsByClassName('home');
	home.length && new Home(home[0]);

	const footer = document.getElementsByClassName('footer');
	footer.length && new Footer(footer[0]);
})
