function serializeObj(obj) {
	var result = [];

	for (var property in obj)
		result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

	return result.join("&");
}
function showMessage($mdToast, messsage){
	$mdToast.show(
		$mdToast.simple()
		.textContent(messsage)
		.position('bottom left')
		.hideDelay(3000)
		);
}
function getToken(secureKey, $base64){
	var f = new Date();
	
	var day = f.getDate();
	var month = f.getMonth()+1;
	var year = f.getFullYear();
	day = (day<10) ? '0'+day : day;
	month = (month<10) ? '0'+month : month;
	var clave = day+month+year+secureKey;

	return $base64.encode(clave);
}