(()=>{async function e(e){const t=`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${e}?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2CresolvedAddress%2Ctemp%2Cfeelslike%2Chumidity%2Cwindspeed%2Cuvindex%2Cconditions%2Cdescription%2Cicon&include=remote%2Cobs%2Ccurrent%2Cfcst&key=T3K39GSEC83MWTCTJQVNUSYSN&contentType=json`,n=await async function(e){const t=await fetch(e);if(!t.ok)throw new Error(t.status);return await t.json()}(t),i=n.resolvedAddress,{currentConditions:s}=n,{temp:o,humidity:r,conditions:c,feelslike:d,windspeed:l}=s;return{address:i,conditions:c,temp:o,feelsLike:d,humidity:r,windSpeed:l}}function t(e){let t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];const i=document.querySelector(".condition"),s=document.querySelector(".address"),o=document.querySelector(".temp"),r=document.querySelector(".feels-like"),c=document.querySelector(".humidity"),d=document.querySelector(".wind");i.innerText=e.conditions,s.innerText=e.address,o.innerText=e.temp,r.innerText=`FEELS LIKE: ${e.feelsLike}`,c.innerText=`HUMIDITY: ${e.humidity}%`,d.innerText=`WIND: ${e.windSpeed} ${n?"KPH":"MPH"}`;const l=t?"C":"F",a=document.createElement("sup");a.classList.add("temp-symbol"),a.innerText="°"+l,o.appendChild(a.cloneNode(!0)),r.appendChild(a.cloneNode(!0));const u=e.conditions.toLowerCase();let m="";u.includes("rain")?m="rainy":u.includes("partially")?m="partially-cloudy":u.includes("cloudy")?m="cloudy":u.includes("overcast")?m="overcast":u.includes("clear")?m="sunny":u.includes("snow")&&(m="snowy"),document.body.classList=[],document.body.classList.add(m)}const n=document.querySelector("#city");n.value="Tehran",e("tehran").then((e=>{t(e)})),document.querySelector("button.submit-city").addEventListener("click",(async i=>{i.preventDefault();const s=n.value;try{t(await e(s))}catch(e){const t=document.querySelector("span.error");t.classList.add("visible"),n.classList.add("error"),400==+e.message?t.innerText="City info is not available :(":t.innerText=e.message}})),n.addEventListener("input",(()=>{const e=document.querySelector("span.error");n.classList.remove("error"),e.classList.remove("visible")}))})();
//# sourceMappingURL=main.js.map