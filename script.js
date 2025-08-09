const cityinput=document.querySelector("#city");
const searchbtn=document.querySelector("#search-button");
const locationbtn=document.querySelector("#current-location");
const weathericon=document.querySelector(".weathericon");
const temperature=document.querySelector(".temperature");
const feelslike=document.querySelector(".feelslike");
const date=document.querySelector(".date");
const time=document.querySelector(".time");
const humidity=document.querySelector(".humidity");
const windspeed=document.querySelector(".windspeed");
const cloud=document.querySelector(".cloud");
const got=document.querySelector(".got");
const day1=document.querySelector("#one");
const day2=document.querySelector("#two");
const day3=document.querySelector("#three");
const day4=document.querySelector("#four");
const day5=document.querySelector("#five");
const recentCitiesDropdown=document.querySelector("#city-select");
const errormessage=document.querySelector("#error-message");
// console.log(temperature )

// function to call api 
 async function getdata(cityname){
const promise =await fetch(`
http://api.weatherapi.com/v1/forecast.json?key=755764a14dda4886bba201629250408&q=${cityname}&days=6&aqi=yes&alerts=yes`);
return await promise.json();

}
function updateRecentCities(city) {
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];

  // Remove duplicates
  cities = cities.filter(c => c.toLowerCase() !== city.toLowerCase());
  cities.unshift(city); // Add to top
  localStorage.setItem("recentCities", JSON.stringify(cities));
  populateRecentCities();
}

function populateRecentCities() {
  const cities = JSON.parse(localStorage.getItem("recentCities")) || [];

  recentCitiesDropdown.innerHTML = `<option value=""> Recent city</option>`;

  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    recentCitiesDropdown.appendChild(option);
  });

}

recentCitiesDropdown.addEventListener("change", async (e) => {
  const selectedCity = e.target.value;
  if (!selectedCity) return;

  try {
    const result = await getdata(selectedCity);
    getinformation(result);
  } catch (error) {
    alert("Error fetching data for selected city.");
    console.error(error);
  }
});

function show(message){
  errormessage.textContent=message;
   errormessage.classList.add("show");


setTimeout(()=>{
   errormessage.classList.remove("show");
    errormessage.textContent="";
},4000);
}




// Event: Search by city
searchbtn.addEventListener("click",async()=>{
 const city=cityinput.value;

 
  if (!city||city.trim() === "") {
    show("Please enter a valid city name.");
    return ;
   
  }
  try{
     const result=await getdata(city);
 console.log(result);
  getinformation(result);

  updateRecentCities(city);
  cityinput.value="";
  } catch (error) {
    show("Something went wrong");
   
  }
  });

 function getinformation(result){

weathericon.innerHTML= `<img src="https:${result.current.condition.icon}" alt="Weather icon">`;
temperature.innerHTML=` <p><strong>Temperature:</strong> ${result.current.temp_c}</p>`;
feelslike.innerHTML=` <p><strong>Feelslike:</strong> ${result.current.feelslike_c}</p>`;
date.innerHTML=` <p><strong>Date:</strong> ${result.forecast.forecastday[0].date}</p>`;
time.innerHTML= ` <p><strong>Time:</strong> ${result.location.localtime}</p>`;
humidity.innerHTML=`<img src="OIP.webp" alt="humidity"<p><strong>Humidity:</strong> ${result.current.humidity}</p>`;
windspeed.innerHTML= ` <img src="wind-icon-vector.jpg" alt="winspeed"<p><strong>Winspeed:</strong> ${result.current.wind_kph}</p>`;
cloud.innerHTML=`<img src="700118-icon-20-clouds-1024.webp" alt="cloud"><p><strong>Cloud:</strong> ${result.current.cloud}</p>`;

   const forecastElements = [day1, day2, day3, day4, day5];
  for (let i = 1; i <= 5; i++) {
    const day = result.forecast.forecastday[i];
    if (day && forecastElements[i - 1]) {
      forecastElements[i - 1].innerHTML = `
        <img src="https:${day.day.condition.icon}" alt="Weather icon">
        <p><strong>Date:</strong> ${day.date}</p>
        <img src="temp.webp"<p><strong>Temperature:</strong> ${day.day.avgtemp_c}°C</p>
        <img src="wind-icon-vector.jpg"<p><strong>Windspeed:</strong> ${day.day.maxwind_kph} kph</p>
        <img src="OIP.webp"<p><strong>Humidity:</strong> ${day.day.avghumidity}%</p>
      `;
    }
  }
}

async function getcords(lat,long){
const promise =await fetch(`
http://api.weatherapi.com/v1/forecast.json?key=755764a14dda4886bba201629250408&q=${lat},${long}&days=6&aqi=yes&alerts=yes`);
return await promise.json();
}

async function gotlocation(position){
const results= await getcords(position.coords.
latitude,position.coords.longitude);
console.log(results);

getinformation(results);
 }

function failure(){
    console.log("failure to get location");
}

locationbtn.addEventListener("click",async()=>{
  const results=navigator.geolocation.getCurrentPosition(gotlocation,failure); 
});

window.addEventListener("DOMContentLoaded", () => {
  populateRecentCities();
});



