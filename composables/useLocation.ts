import { DataProps } from "~/app.vue";

const useLocation = () => {
  const {
    public: publicRuntimeConfig
  } = useRuntimeConfig()

  const appid = publicRuntimeConfig.API_KEY;

  let params = ref({
    lat: "",
    lon: "",
    appid,
  });

  const { data } = useFetch<DataProps>(`https://api.openweathermap.org/data/2.5/weather`, {
    query: params,
  });

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  };

  const showPosition = async (position: any) => {
    params.value = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      appid,
    };
  };

  return {
    data,
    getLocation,
  };
};

export default useLocation;