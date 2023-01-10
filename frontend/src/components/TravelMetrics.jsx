import axios from 'axios'
import {useState} from 'react'

export default function TravelMetrics({originAddress, destinationAddress}) {

  const [travelTime, setTravelTime] = useState(null)
  const [travelDistance, setTravelDistance] = useState(null)

  const handleTravelMetrics = async () => {
    const [o, d] = [originAddress, destinationAddress]
    const response = await axios.post('api/get_data/', {
      'action': 'travel',
      'originAddress': `${o.street}, ${o.city}, ${o.state} ${o.zip}`,
      'destinationAddress': `${d.street}, ${d.city}, ${d.state} ${d.zip}`,})
    setTravelDistance(response.data.results.distance)
    setTravelTime(response.data.results.duration)}

  return(
    <>
      <p>Origin: {originAddress.street}, {originAddress.city}</p>
      <p>Destination: {destinationAddress.street}, {destinationAddress.city}</p>
      {travelTime && 
        <p>Time to get there: {travelTime}</p>}
      {travelDistance && 
        <p>Distance to get there: {travelDistance} miles</p>}
      <input type='button' value='get travel metrics' onClick={handleTravelMetrics} />
    </>
  )
}