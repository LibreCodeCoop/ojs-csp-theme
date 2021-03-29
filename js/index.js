function replaced(item) {
	let splitChild = item.textContent.split('*');

	let text = [];
	for (let i = 0; i < splitChild.length - 1; i++) {
		text = text + '<li>' + splitChild[i + 1] + '</li>';
	}
	return splitChild[0] + '<ol class="list-second">' + text + '</ol>';
}

const listGroup = document.getElementsByClassName('submission-list-group')[0]
	.children;

for (var i = 0; i < listGroup.length; i++) {
	if (listGroup[i].textContent.includes('*')) {
		let text = replaced(listGroup[i]);
		listGroup[i].innerHTML = text;
	}
}
