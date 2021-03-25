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

const viewAll  = document.querySelectorAll('.view-all');
const navigationLink = document.querySelectorAll('.navigation-link:not(.view-all)');
const longGoodsList = document.querySelector('.long-goods-list');
const showAcsessories = document.querySelectorAll('.show-acsessories');
const showClothing = document.querySelectorAll('.show-clothing');

const cartTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');


const getGoods = async function (){
	const result = await fetch('db/db.json');
	if(!result.ok){
		throw "Some Error: " + result.status
	}
	return await result.json();
};

// Cart
const cart = {
	cartGoods: [],

	renderCart(){
		cartTableGoods.textContent = ''; //clear cart
		this.cartGoods.forEach(({id,name,price,count}) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;

			trGood.innerHTML = `
					<td>${name}</td>
					<td>${price}$</td>
					<td><button class="cart-btn-minus">-</button></td>
					<td>${count}</td>
					<td><button class="cart-btn-plus">+</button></td>
					<td>${price * count}$</td>
					<td><button class="cart-btn-delete">x</button></td>
			
			`;
			cartTableGoods.append(trGood);
		});

		const totalPrice = this.cartGoods.reduce((sum, item)=>{
			return sum + item.price * item.count;
			}, 0);

		cardTableTotal.textContent = totalPrice + '$';

	},

	deleteGood(id){
		this.cartGoods = this.cartGoods.filter((item => id !== item.id));
		this.renderCart();
	},

	minusGood(id){
		for(const item of this.cartGoods){
			if(item.id ===id){
				if(item.count <= 1){
					this.deleteGood(id);
				} else{
					item.count--;
				}
				break;
			}
		}
		this.renderCart();
	},
	
	plusGood(id){
		for(const item of this.cartGoods){
			if(item.id ===id){
				item.count++;
				break
			}
		}


		this.renderCart();
	},

	addCartGoods(id){
		const goodItem = this.cartGoods.find(item=> item.id === id);
		if(goodItem){
			this.plusGood(id);
		} else{
			getGoods()
			.then(data => data.find(item => item.id === id))
			.then(({id,name,price}) =>{
				this.cartGoods.push({
					id,
					name,
					price,
					count: 1
				});
			})
		}

	},
}

document.body.addEventListener('click',e =>{
	const addToCart = e.target.closest('.add-to-cart');
	if(addToCart){
		cart.addCartGoods(addToCart.dataset.id);
	}
})

cartTableGoods.addEventListener('click',(e)=>{
 	const target = e.target;

  if(target.tagName === 'BUTTON'){
	 const id = target.closest('.cart-item').dataset.id;

	 	if(target.classList.contains('cart-btn-delete')){
		cart.deleteGood(id);
		};

		if(target.classList.contains('cart-btn-minus')){
				cart.minusGood(id);
		};

		if(target.classList.contains('cart-btn-plus')){
				cart.plusGood(id);
			}
		};
})

// modal window
const openModal = ()=> { 
	cart.renderCart();
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
				scrollLinks[i].addEventListener('click', e => {
					e.preventDefault();
					let id = scrollLinks[i].getAttribute('href');
					document.querySelector(id).scrollIntoView({
						behavior: 'smooth',
						block: 'start',
					})
				});
			};
			})();


// goods

getGoods().then(function(data){
});

	const createCard = function({label,name,img,description,id,price}){
		const card = document.createElement('div');
		card.className = 'col-lg-3 col-sm-6';

		card.innerHTML = `
					<div class="goods-card">
					${label ? `<span class="label">${label}</span>` : ''}	
						<img src="db/${img}" alt="${name}" class="goods-image">
						<h3 class="goods-title">${name}</h3>
						<p class="goods-description">${description}</p>
						<button class="button goods-card-btn add-to-cart" data-id="${id}">
						<span class="button-price">$ ${price}</span>
						</button>
					</div>
		`;
		return card;

	}

	const renderCard = function (data){
		longGoodsList.textContent = '';
		const cards = data.map(createCard);
		longGoodsList.append(...cards)

		document.body.classList.add('show-goods');

	};

	const showAll = function (e){
		e.preventDefault();
		getGoods().then(renderCard);

	};

	viewAll.forEach(function(elem){
		elem.addEventListener('click',(e)=>{
		e.preventDefault();
		getGoods().then(renderCard);

		})
	});


	const filterCards = function(field,value){
		getGoods().then( data => data.filter( good => good[field] === value))
		.then(renderCard);
	};
	
	navigationLink.forEach((link)=>{
		link.addEventListener('click', e =>{
			e.preventDefault();
			const field = link.dataset.field;
			const value = link.textContent;
			filterCards(field,value)

		})
	});


	showAcsessories.forEach(item =>{
		item.addEventListener('click',e =>{
		e.preventDefault();
		filterCards('category','Accessories');
	})
	});
	

	showClothing.forEach(item =>{
		item.addEventListener('click',e =>{
		e.preventDefault();
		filterCards('category','Clothing');
	})
	});
	





