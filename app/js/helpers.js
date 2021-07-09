import {throttle } from 'lodash-es';

export function handleAnimationContainer ($root) {
	const $scroll = $('.section__scroll');

	$scroll.lenght && $scroll.addClass('section__scroll--visible');

  const handleAnimation = () => {
    $root.each((index, container) => {
      if (container.hasAttribute('data-not-animate')) return;
      if (container.getBoundingClientRect().top <= Math.abs(window.outerHeight - 200) || container.getBoundingClientRect().top < window.innerHeight ) {
        container.classList.add('container--animated');
      }
    });
  }

  handleAnimation();
  $(window).on('scroll', throttle(handleAnimation, 150));  
}