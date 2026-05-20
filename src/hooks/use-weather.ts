import { useEffect, useState } from "react"

type WeatherState = {
  city: string
  temperature: number
  weatherCode: number
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherState>({
    city: "",
    temperature: 0,
    weatherCode: 0,
  })

  const [weatherLoading, setWeatherLoading] = useState(true)
  const [weatherError, setWeatherError] = useState("")

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          )

          if (!weatherResponse.ok) {
            throw new Error("Failed to fetch weather")
          }

          const weatherData = await weatherResponse.json()

          const currentWeather = weatherData.current_weather

          if (!currentWeather) {
            throw new Error("No weather data received")
          }

          setWeather({
            city: "Pune, Maharashtra",
            temperature: currentWeather.temperature ?? 0,
            weatherCode: currentWeather.weathercode ?? 0,
          })
        } catch (error) {
          console.error("Weather Error:", error)
          setWeatherError("Unable to fetch weather")
        } finally {
          setWeatherLoading(false)
        }
      },
      (error) => {
        console.error(error)

        if (error.code === 1) {
          setWeatherError("Location permission denied")
        } else if (error.code === 2) {
          setWeatherError("Location unavailable")
        } else {
          setWeatherError("Location timeout")
        }

        setWeatherLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }, [])

  return {
    weather,
    weatherLoading,
    weatherError,
  }
}
