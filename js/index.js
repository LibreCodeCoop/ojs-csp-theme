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

function httpGet(url) {
	try {
		const xmlHttp = new XMLHttpRequest();
		xmlHttp.open('GET', url, false);
		xmlHttp.send(null);
		return JSON.parse(xmlHttp.responseText);
	} catch (err) {
		console.error(err);
	}
}

function getDataByGoogle(key, channelId) {
	const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=1&order=date&type=video&videoEmbeddable=true&key=${key}`;
	const data = httpGet(url);
	return data.items[0].id.videoId;
}

function inserVideo(videoId, domain) {
	document.getElementById(
		'video'
	).innerHTML = `<iframe id="player" type="text/html" frameborder="0" src="http://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=http://${domain}"></iframe>`;
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
const videoId = getDataByGoogle('key', 'UCBc00LEzZ6Vqi8EcBoCLaYA');
inserVideo(videoId, 'localhost');
setTimeout(() => {
	changeOrcidStyle(orcidLabel, orcidID);
}, 1000);
