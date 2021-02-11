// geo locate
let lat, lon;

function updateLatLon() {
  if ("geolocation" in navigator) {
    /* geolocation is available */
    console.log("geolocation is available on this computer");
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        let timestamp = position.timestamp;
  
        // update DOM
        document.getElementById("latitude").textContent = lat.toFixed(2);
        document.getElementById("longitude").textContent = lon.toFixed(2);
  
        //get weather data
        // const weatherKey = "f97452ca459d8064e77b178fbb42c4d4";
        const weatherURL = `/weather/${lat},${lon}`;
        const res = await fetch(weatherURL);
        const dataFromServer = await res.json();
        const weather = dataFromServer.weather;
        const aq = dataFromServer.airQuality;

        // send post request to db
        const data = { lat, lon, timestamp, weather, aq };
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };
  
        const response = await fetch("/api", options);
        const json = await response.json();
        console.log(json);

        document.getElementById("summary").textContent =
          weather.weather[0].description;
        document.getElementById("temperature").textContent =
          weather.main.temp;
  
        // display info on air quality
        // console.log(dataFromServer.airQuality.results[0].measurements);
        const measurements = aq.results[0].measurements;
        // build html for each measurement
        document.getElementById("measurements").innerHTML = "";
        for (const measurement of measurements) {
          const root = document.createElement("p");
          const paramB = document.createElement("b");
          paramB.textContent = `${measurement.parameter}: `;
          const measurementSpan = document.createElement("span");
          measurementSpan.textContent = `${measurement.value}${measurement.unit} `;
          const updatedB = document.createElement("b");
          updatedB.textContent = `Updated: `;
          const updatedSpan = document.createElement("span");
          updatedSpan.textContent = new Date(
            measurement.lastUpdated
          ).toLocaleString();
  
          root.append(paramB, measurementSpan, updatedB, updatedSpan);
          document.getElementById("measurements").append(root);
        }
      } catch (error) {
        console.log(error);
        document.getElementById('measurements').textContent = 'No Readings available';
      }
      
    });
  } else {
    /* geolocation IS NOT available */
    console.log("geolocation is not available on this computer");
  }
}

window.onload = function () {
  updateLatLon();

  // document.getElementById("geolocate").addEventListener("click", updateLatLon);
};
