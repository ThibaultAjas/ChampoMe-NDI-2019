$(document).ready(function(){
	var timer = $("#timer");
	var playButton = $("#playButton");
	var startTime;


	function isTimerNotSet() {
		return localStorage.getItem("temps") == null;
	}

	playButton.click(function() {
		localStorage.setItem("hasStart", true);
	});


	if (localStorage.getItem("hasStart") == "true") {
		if (isTimerNotSet()) {
			startTime = new Date().getTime();	
			localStorage.setItem("temps", startTime);
		} else {
			startTime = localStorage.getItem("temps");
		}

		var timerInterval = setInterval(function() {		
			let now = new Date().getTime();

			let distance = now - startTime;
			let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			let seconds = Math.floor((distance % (1000 * 60)) / 1000);

			timer.text("Temps écoulé: " + hours + "h " + minutes + "m " + seconds + "s.");

			if (hours != 0) {
				clearInterval(timerInterval);
				timer.text("Temps expiré! Réessayez plus tard :)");
			}

		}, 1000);
	}
});
