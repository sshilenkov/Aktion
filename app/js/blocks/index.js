import { handleButtonDown } from './button-down';

export default () => {
  const $buttonDown = $('.js-button-down');
  $buttonDown.length && handleButtonDown($buttonDown);
};
