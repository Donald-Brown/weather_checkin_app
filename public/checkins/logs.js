// Making a map and tiles
const myMap = L.map('checkinMap').setView([0, 0], 1);
// const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';


const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileUrl = 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';

const tiles = L.tileLayer(tileUrl, { attribution } );
tiles.addTo(myMap);

getData();

// get request to database
async function getData() {
  const res = await fetch('/api');
  const data = await res.json();
  console.log(data);

  // sort the data by timestamp
  data.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1);

  // display results
  for (let item of data) {
    const marker = L.marker([item.lat, item.lon]).addTo(myMap);
    let text = `<div>The weather here at ${item.lat}&deg;, ${item.lon}&deg; is ${item.weather.weather[0].description} with a temperature of ${item.weather.main.temp}&deg;F</div>`;

    const aqMeasurements = item.aq.results ? item.aq.results[0].measurements : null;

    if (aqMeasurements) {
      for (let measurement of aqMeasurements) {
        text += `<p><b>${measurement.parameter}:</b> ${measurement.value}${measurement.unit} - <b>Updated: </b>${new Date(measurement.lastUpdated).toLocaleDateString()}</p>`;
      }
    } else {
      text += `<p>No air quality readings</p>`
    }
    marker.bindPopup(text);



    // const root = document.createElement('div');
    // root.className = 'root_div';
    // const geo = document.createElement('div');
    // geo.className = 'geo_div';
    // const date = document.createElement('div');

    // geo.textContent = `${item.lat}°, ${item.lon}°`;
    // const dateString = new Date(item.timestamp).toLocaleString();
    // date.textContent = dateString;

    // root.append(geo, date);
    // document.body.append(root);
  }
  console.log(data);
}

    