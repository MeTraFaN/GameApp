function ShowErrore(first){
	ErroreWindow = document.createElement('div');
	ErroreWindow.className = "ErroreWindow";
	ErroreWindow.innerHTML = first;
	document.body.appendChild(ErroreWindow);
}

function deleteElement(Element){
	if (Element) {
		document.body.removeChild(Element)
	}
};



