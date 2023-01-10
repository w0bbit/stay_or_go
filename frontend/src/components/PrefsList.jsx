import {useState} from 'react'
import axios from 'axios'

export default function PrefsList() {
  const [prefs, setPrefs] = useState([])

  const handleGetPrefs = async (event) => {
    event.preventDefault()
    const response = await axios.get('api/view_prefs/')
    const items = []
    const preferences = response.data
    items.push(
      <p>id: {preferences.id}</p>,
      <p>crime_national: {preferences.crime_national}</p>,
      <p>crime_city: {preferences.crime_city}</p>,
      <p>gas_cost: {preferences.gas_cost}</p>,
      <p>temperature: {preferences.temperature}</p>,
      <p>weather_descriptors: {preferences.weather_descriptors}</p>,
      <p>travel_time: {preferences.travel_time}</p>,
      <p>travel_distance: {preferences.travel_distance}</p>,
      <p>foot_traffic: {preferences.foot_traffic}</p>,
    )
    setPrefs(items)
    console.log(response.data.prefs)
  }

  return(
    <>
      <br /><input type='button' value='Display Prefs' onClick={handleGetPrefs} />
      {prefs.length > 0 && prefs}
    </>
  )
}