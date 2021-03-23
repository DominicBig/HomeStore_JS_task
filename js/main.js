const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

//cart

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close');
const overlay = document.querySelector('.overlay');


const openModal = () =>{ 
	modalCart.classList.add('show');
};

const closeModal = (e) =>{ 
	if(e.target.classList.contains('overlay') || e.target.classList.contains('modal-close')){
		modalCart.classList.remove('show');
	} 
};


buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);


// smooth scroll animation
	(function ()  {
	const scrollLinks = document.querySelectorAll('a.scroll-link');
			for( let i = 0; i < scrollLinks.length; i++){
				scrollLinks[i].addEventListener('click', function(e){
					e.preventDefault();
					let id = scrollLinks[i].getAttribute('href');
					document.querySelector(id).scrollIntoView({
						behavior: 'smooth',
						block: 'start',
					})
				});
			};
			})();

	





