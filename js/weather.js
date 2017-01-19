//Attempt to get location data from browser.  Execute error function on fail.
navigator.geolocation.getCurrentPosition(success, error);

//On success get lat lon coordinates and request call API.
function success(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  request(lat, lon);
};

//Log a warning in console on geolocation fail.
function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

//Call the API and parse response.  Call functions to update HTML elements.
function request(lat, lon) {
	var xmlhttp = new XMLHttpRequest();
	var url = "http://api.wunderground.com/api/e9bfe49efa7bf7a1/conditions/q/" + lat + "," + lon + ".json";
	xmlhttp.open("GET", url, true);
	xmlhttp.onreadystatechange = function() {
		if (this.status == 200 && this.readyState == 4) {
			response = JSON.parse(this.responseText);
			updateText(response);
			updateTherm(response);
		}
	}
	xmlhttp.send();
}

//Update HTML elements with data from API response.
function updateText(response) {
	var loc = document.getElementById("location");
	var temp = document.getElementById("temperature");
	var dewpoint = document.getElementById("dewpoint");
	var current = document.getElementById("current");
	var image = document.getElementById("image");

	loc.innerHTML = response.current_observation.display_location.full;
	temp.innerHTML = "Temperature: " + response.current_observation.temperature_string;
	dewpoint.innerHTML = "Dewpoint: " + response.current_observation.dewpoint_string;
	current.innerHTML = response.current_observation.weather;
	image.src = response.current_observation.icon_url;
}

//Initialize variables for thermometer animation and animate.
function updateTherm(response) {
	var temp = document.getElementById("temperature");
	var red = document.getElementById("red");
	var white = document.getElementById("white");
	var calculatedHeight = calculateHeight(response);
	var redHeight = 0;
	var whiteHeight = 300;

	animateTherm(red, white, redHeight, whiteHeight, calculatedHeight);
}

//Returns height red element of thermometer needs to be to display temperature
//accurately. 
function calculateHeight(response) {
	var height;
	temperature = Math.round(response.current_observation.temp_f);
	 
	if (temperature == 0) {
		height = 50;
		return height;
	} else if (temperature > 0) {
		height = temperature * 2 + 50;
		return height;
	} else {
		height = 50 + temperature * 2;
		return height;
	}
}

//Increase height of red element and decrease white until calculatedHeight of
//red element is reached. 
function animateTherm(red, white, rh, wh, stopPoint) {
	if (rh < stopPoint) {
		rh += 1;
		wh -= 1;
		red.style.height = rh + "px";
		white.style.height = wh + "px";
		setTimeout(animateTherm, 10, red, white, rh, wh, stopPoint);
	}
	else {
		return;
	}
}
