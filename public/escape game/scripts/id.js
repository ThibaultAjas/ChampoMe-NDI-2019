$(document).ready(function() {
	var helpButton = $("#help");
	var submitButton = $("#sendCode");
	var input = $("#codeInput");

	submitButton.click(function() {
		if (localStorage.getItem("idCard") == "false") {
			let code = $(input).val();

			if (code.toUpperCase() == "MAIRIE") {
				alert("Bravo, vous avez désormais votre carte d'identité!");
				var currentUrl = $(location).attr('href');
				var newUrl = currentUrl.substr(0,currentUrl.lastIndexOf('/') + 1);
				console.log(newUrl + "rib.html");
				
				localStorage.setItem("idCard", true);

				window.location.replace(newUrl+ "rib.html");
				/*var currentUrl = $(location).attr('href');
				console.log(currentUrl);*/
				
			} else {
				alert("Malheureusement, votre code ne semble pas être le bon.. + 2 minutes");
				localStorage.setItem("temps", localStorage.getItem("temps") - 2 * 1000 * 60);
			}
		}
	});

	helpButton.click(function() {
			

		if (localStorage.getItem("idCard") == "false") {
			$("#tip").text("Chaque nombre correspond à sa position dans l'alphabet. Un espace signifie une lettre avec une position supérieure à 10. 2 espaces pour une nouveau mot");
			localStorage.setItem("temps", localStorage.getItem("temps") - 10 * 1000 * 60);
		}
	})
});