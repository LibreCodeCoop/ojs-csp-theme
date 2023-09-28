// eslint-disable-next-line no-unused-vars
function eventClick(elem) {
	elem.parentElement.parentElement.classList.toggle('aside-active');
}

$(function() {
	$('aside').removeClass('col-md-4');
	$('aside').addClass('col-md-3');

	$('main').removeClass('col-md-8');
	$('main').addClass('col-md-9');
});

