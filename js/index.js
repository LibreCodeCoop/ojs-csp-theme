// eslint-disable-next-line no-unused-vars
function eventClick(elem) {
	elem.parentElement.parentElement.classList.toggle('aside-active');
}

function changeOrcidStyle(objLabel, objID) {
	for (let i = 0; i < objLabel.length; i++) {
		objLabel[i].textContent === 'ORCID'
			? objLabel[i].classList.add('orcid-label')
			: false;
		objLabel[i].textContent === 'ORCID'
			? (objLabel[i].textContent = 'iD')
			: false;
	}
	for (let i = 0; i < objID.length; i++) {
		objID[i].textContent = 'https://orcid.com/' + objID[i].textContent;
		objID[i].href =
			'https://orcid.com/' + objID[i].href.split('view/')[1].split('/')[1];
	}
}

function replaced(item) {
	let splitChild = item.textContent.split('*');

	let text = [];
	for (let i = 0; i < splitChild.length - 1; i++) {
		text = text + '<li>' + splitChild[i + 1] + '</li>';
	}
	return (
		'<span>' +
		splitChild[0] +
		'</span>' +
		'<ol class="list-second">' +
		text +
		'</ol>'
	);
}

const listGroup =
	document.getElementsByClassName('submission-list-group').length > 0
		? document.getElementsByClassName('submission-list-group')[0].children
		: false;

if (listGroup) {
	for (var i = 0; i < listGroup.length; i++) {
		if (listGroup[i].textContent.includes('*')) {
			let text = replaced(listGroup[i]);
			listGroup[i].innerHTML = text;
		}
	}
}

const orcidLabel = document.getElementsByClassName('label');
const orcidID = document.getElementsByClassName('orcid');
setTimeout(() => {
	changeOrcidStyle(orcidLabel, orcidID);
}, 1000);
