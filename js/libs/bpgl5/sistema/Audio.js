define([],function() {

	var object={};

	var buffer={};

	var soundOn=true;

	object.turnOff = function() {
		soundOn=false;
	}

	object.turnOn = function() {
		soundOn=true;
	}

	object.turnOnOff = function() {
		soundOn=!soundOn;
	}

	object.play = function(nome,loop,volume) {
		if (!soundOn)
			return;

		var audio = buffer[nome];

		if (!audio) {
			audio = document.createElement("audio");
			audio.src = "./audio/"+nome;

			document.body.appendChild(audio);
			audio={'element':audio};
			buffer[nome]=audio;
		} else {
			audio.element.pause();
			audio.element.currentTime = 0;
		}

		if (!loop)
			loop=audio.loop || false;
		else
			loop=audio.loop || true;

		if (!volume)
			volume=audio.volume || 1;

		audio.volume=volume;
		audio.loop=loop;

		audio.element.volume=volume;
		audio.element.loop=loop;
		
		audio.playing=true;
		audio.element.play();
	}

	object.pause = function(nome) {
		var audio = buffer[nome];
		if (audio) {
			audio.element.pause();
			audio.playing=false;
		}
	}

	object.pauseOrPlay = function(nome) {
		var audio = buffer[nome];
		if (audio) {
			if (audio.playing)
				object.pause(nome);
			else
				object.play(nome);
			return audio.playing;
		}
		return false;
	}

	return object;

});