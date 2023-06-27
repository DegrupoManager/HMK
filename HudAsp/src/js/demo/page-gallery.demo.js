/*
Template Name: HUD ASP - Responsive Bootstrap 5 Admin Template
Version: 2.0.0
Author: Sean Ngu
Website: http://www.seantheme.com/hud-asp/
*/

import PhotoSwipeLightbox from '../../lib/photoswipe/dist/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
	gallery: '.gallery-image-list',
	children: 'a',
	pswpModule: () => import('../../lib/photoswipe/dist/photoswipe.esm.js')
});
lightbox.init();