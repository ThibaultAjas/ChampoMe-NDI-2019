$(document).ready(function() {
	const goodCode = 4242;

	var submitButton = $("#sendRIBcode");
	var input = $("#codeInput");
	var afterCode = $("#afterCode");

	submitButton.click(function() {
		if (localStorage.getItem("rib") == "false") {
			let code = $(input).val();

			if (code == "4242") {
				alert("Bravo, vous avez désormais votre RIB!");
				var currentUrl = $(location).attr('href');
				var newUrl = currentUrl.substr(0,currentUrl.lastIndexOf('/') + 1);
				localStorage.setItem("rib", true);
				window.location.replace(newUrl+ "vitale.html");
			} else {
				alert("Malheureusement, votre code ne semble pas être le bon.. + 2 minutes");
				localStorage.setItem("temps", localStorage.getItem("temps") - 2 * 1000 * 60);
			}
		}
	});
});