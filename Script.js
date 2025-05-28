document.addEventListener("DOMContentLoaded", () => {
  const apiKey = 'b6907d289e10d714a6e88b30761fae22'; // Replace with your own key

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        const currentData = await currentRes.json();
        displayCurrentWeather(currentData);

        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        const forecastData = await forecastRes.json();
        displayForecast(forecastData);
      } catch (error) {
        console.error("Fetch failed:", error);
        alert("Unable to retrieve weather data.");
      }
    }, () => {
      alert("Location access denied.");
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
})
  function displayCurrentWeather(data) {
  const el = document.getElementById('current-weather');

  if (!data || data.cod !== 200) {
    el.innerHTML = `<p>Error: ${data.message || 'Unable to load current weather.'}</p>`;
    return;
  }

  el.innerHTML = `
    <p><strong>Location:</strong> ${data.name}</p>
    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
    <p><strong>Condition:</strong> ${data.weather[0].description}</p>
  `;
}


function displayForecast(data) {
  const el = document.getElementById('forecast-weather');

  if (!data || data.cod !== "200") {
    el.innerHTML = `<p>Error: ${data.message || 'Unable to load forecast.'}</p>`;
    return;
  }

  el.innerHTML = '';
  const forecastList = data.list.filter((_, index) => index % 8 === 0); // daily
  forecastList.forEach(item => {
    const date = new Date(item.dt_txt).toLocaleDateString();
    el.innerHTML += `
      <div>
        <p><strong>${date}</strong></p>
        <p>Temp: ${item.main.temp}°C, ${item.weather[0].description}</p>
      </div>
      <hr />
    `;
  });
}

