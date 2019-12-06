$(document).ready(function() {
	var helpButton = $("#help");
	var submitButton = $("#sendCode");
	var input = $("#codeInput");

	submitButton.click(function() {
		if (localStorage.getItem("secu") == "false") {
			let code = $(input).val();

			if (code=="950") {
				alert("Bravo, vous avez désormais votre carte d'identité!");
				var currentUrl = $(location).attr('href');
				var newUrl = currentUrl.substr(0,currentUrl.lastIndexOf('/') + 1);
				localStorage.setItem("secu", true);
				window.location.replace(newUrl+ "bravo.html");
			} else {
				alert("Malheureusement, votre code ne semble pas être le bon.. + 2 minutes");
				localStorage.setItem("temps", localStorage.getItem("temps") - 2 * 1000 * 60);
			}
		}
	});

	helpButton.click(function() {
			

		if (localStorage.getItem("secu") == "false") {
			$("#tip").text("additionner tous les nombres sur la ligne du bas de la carte");
			localStorage.setItem("temps", localStorage.getItem("temps") - 10 * 1000 * 60);
		}
	})
});