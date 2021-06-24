import {throttle } from 'lodash-es';

export function handleAnimationContainer ($root) {
  const $container = $root;
	const $scroll = $('.section__scroll');

	$scroll.lenght && $scroll.addClass('section__scroll--visible');

  $container.each((index, container) => {
      if (container.getBoundingClientRect().top <= window.outerHeight - 200) {
          container.classList.add('container--animated');
      }
  });

  $(window).on('scroll', throttle(() => {
    $container.each((index, container) => {
        if (container.getBoundingClientRect().top <= window.outerHeight - 200) {
            container.classList.add('container--animated');
        }
    });
  }, 150))
}