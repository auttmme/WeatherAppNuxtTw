<script setup lang="ts"> 
    import { onMounted } from "vue";
    import sunny from "~/src/image/sunny.svg";
    import cloud from "~/src/image/cloud.png"
    import rain from "~/src/image/rain.png"
    import thunder from "~/src/image/thunder.png"
    import haze from "~/src/image/haze.png"
    
    const result = ref()
    
    const {
      public: publicRuntimeConfig
    } = useRuntimeConfig()

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition); 
      }
    }

    const showPosition = async (position: any) => {
    const params = {
      lat : position.coords.latitude,
      lon : position.coords.longitude,
      appid: publicRuntimeConfig.API_KEY
    }
    const { data } = await useFetch('https://api.openweathermap.org/data/2.5/weather', {
      query: params,
    })
    result.value = data;
  }

  const icon = (weather: string) => {
    if (weather?.includes('clear')) {
      return sunny
    }
    if (weather?.includes('cloud')) {
      return cloud
    }
    if (weather?.includes('haze')) {
      return haze
    }
    if (weather?.includes('rain') || weather?.includes('drizzle')) {
      return rain
    }
    if (weather?.includes('thunder')) {
      return thunder
    }
  }

  const weatherBackground = (weather: string) => {
    return {
      'bg-sunny': weather === 'clear',
      'bg-cloudy': weather && (weather?.includes('haze') || weather?.includes('cloud')),
      'bg-rain': weather && weather?.includes('rain') || weather?.includes('drizzle'),
      'bg-thunder': weather && weather?.includes('thunder')
    }
  }

  const kelvinToCelcius = (kelvin: number) => {
    const tempC = kelvin - 273.15
    return Math.round(tempC * 10) / 10
  }

  const getDate = () => {
    return new Date().toLocaleDateString('en-GB')
  }

  const getTime = () => {
    const hour = new Date().getHours();
    let minutes = new Date().getMinutes();
    const formatMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return {
      hour: hour,
      minutes: formatMinutes
    }
  }

    onMounted(() => {
      getLocation()
    })
</script>

<template>
  <div :class="weatherBackground(result?.value?.weather[0].description)" class="text-black">
    <div class="frosted-background flex justify-center items-center h-screen w-full">
      <div class="card glass py-10 px-8 w-3/4 md:w-1/2">
        <h1 class="card-title text-3xl font-semibold mb-1">{{result?.value?.name}}</h1>
        <p>{{ getDate() }}, {{ getTime().hour }}:{{ getTime().minutes }}</p>     
          <div class="flex flex-col md:flex-row items-center md:items-end justify-center md:justify-between">
            <div class="flex flex-col md:flex-row items-center mt-8">
              <img class="icon-weather" :src="icon(result?.value?.weather[0].description)" />
              <p class="font-bold text-4xl xl:text-7xl ml-2">{{ kelvinToCelcius(result?.value?.main.temp) }}°C</p>
            </div>
            <div class="text-center">
              <p class="font-semibold text-xl md:text-3xl mb-1">{{ result?.value?.weather[0].description }}</p>
              <p>Feels like {{ kelvinToCelcius(result?.value?.main.feels_like) }}°C</p>
            </div>
          </div>
          <hr class="my-8" />
          <div class="flex justify-center w-100">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-20" >
              <div class="flex flex-col items-center">
                <div class="flex justify between">
                  <Icon name="ph:wind" size="24px" />
                  <p class="text-center ml-2">{{ result?.value?.wind.speed }}km/h</p>
                </div>
                <p>Wind</p>
              </div>
              <div class="flex flex-col items-center">
                <div class="flex justify between">
                  <Icon name="carbon:humidity" size="24px" />
                  <p class="text-center ml-2">{{ result?.value?.main.humidity }}%</p>
                </div>
                <p>Humidity</p>
              </div>
              <div class="flex flex-col items-center">
                <div class="flex justify between">
                  <Icon name="carbon:cloud" size="24px" />
                  <p class="text-center ml-2">{{ result?.value?.clouds?.all }}%</p>
                </div>
                <p>Cloud</p>
              </div>
            </div>     
          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .frosted-background { 
  background: rgba(255, 255, 255, 0.19);
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(3.4px);
  -webkit-backdrop-filter: blur(3.4px);
  }

  .weather-container {
    width: 560px;
  }

  .icon-weather {
    animation: icon-weather 3.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  @keyframes icon-weather {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

</style>