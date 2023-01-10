import {useState} from 'react'
import axios from 'axios'

export default function Weather({originAddress, destinationAddress}) {

  const [originWeather, setOriginWeather] = useState(null)
  const [destinationWeather, setDestinationWeather] = useState(null)

  const getWeather = async address => {
    const lat = address.lat
    const lng = address.lng
    const response = await axios.post('api/get_data/', {
      'action': 'weather', 
      'lat': lat,
      'lng': lng,
    })
    const weatherDescription = response.data.results.summary[0].description
    const temp = response.data.results.temps
    return([weatherDescription, temp])}
  
  const handleWeather = async () => {
    setOriginWeather(await getWeather(originAddress))
    setDestinationWeather(await getWeather(destinationAddress))
    console.log(originWeather)}

  return(
    <>
      <p>Origin: {originAddress.street}, {originAddress.city}</p>
      <p>Destination: {destinationAddress.street}, {destinationAddress.city}</p>
      {originWeather && 
        <>
          <p>Origin summary: {originWeather[0]}</p>
          <p>Origin Temp: {originWeather[1]}F</p>
        </>}
      {destinationWeather && 
        <>
          <p>Destination summary: {destinationWeather[0]}</p>
          <p>Destination Temp: {destinationWeather[1]}F</p>
        </>}

      <input type='button' value='get weather metrics' onClick={handleWeather} />

    </>
  )
}