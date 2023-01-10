import {useState} from 'react'
import axios from 'axios'
import {Form} from 'react-bootstrap'

export default function SetPrefs({resetPrefs}) {

  const [isVisible, setIsVisible] = useState('crimeSection')
  const [crimeNational, setCrimeNational] = useState('1')
  const [crimeCity, setCrimeCity] = useState('1')
  const [temperature, setTemperature] = useState('1')
  const [weatherDescriptors, setWeatherDescriptors] = useState([])
  const [travelTime, setTravelTime] = useState('0')
  const [travelDistance, setTravelDistance] = useState('0')
  const [footTraffic, setFootTraffic] = useState('2')
  const [prefs, setPrefs] = useState({
    crime_national: crimeNational,
    crime_city: crimeCity,
    gas_cost: '0',
    travel_time: travelTime,
    travel_distance: travelDistance,
    temperature: temperature,
    weather_descriptors: weatherDescriptors,
    foot_traffic: footTraffic,
  })

  const handleCrimeCity = event => {
    event.preventDefault()
    setCrimeCity(event.target.value)
    updatePrefs()
  }

  const handleCrimeNational = event => {
    event.preventDefault()
    setCrimeNational(event.target.value)
    updatePrefs()
  }

  const handleTemperature = event => {
    event.preventDefault()
    setTemperature(event.target.value)
    updatePrefs()
  }

  const handleWeatherDescriptors = event => {
    const weatherDescriptorsList = []
    for (let option of document.getElementById('weatherDescriptors')) {
      if (option.selected == true) {
        weatherDescriptorsList.push(option.value)
      }
    }
    setWeatherDescriptors(weatherDescriptorsList)
    updatePrefs()
  }

  const handleTravelTime = event => {
    event.preventDefault()
    setTravelTime(event.target.value)
    updatePrefs()
  }

  const handleTravelDistance = event => {
    event.preventDefault()
    setTravelDistance(event.target.value)
    updatePrefs()
  }

  const handleFootTraffic = event => {
    event.preventDefault()
    setFootTraffic(event.target.value)
    updatePrefs()
    console.log(footTraffic)
  }

  const updatePrefs = event => {
    setPrefs({
      crime_national: crimeNational,
      crime_city: crimeCity,
      gas_cost: '0',
      travel_time: travelTime,
      travel_distance: travelDistance,
      temperature: temperature,
      weather_descriptors: weatherDescriptors,
      foot_traffic: footTraffic,      
    })
  }

  const handleSubmitPrefs = async (event) => {
    event.preventDefault()
    console.log(prefs)
    const response = await axios.post('api/set_prefs/', prefs)
    console.log(response)
    resetPrefs(prefs)
    setIsVisible('crimeSection')
  }

  return(
    <center>
      <br />
      <div>
      <div style={{width:'315px',textAlign:'left',height:'135px'}}>
      
      {isVisible == 'crimeSection' && 
        <div id='crimeSection'>
          <label>Crime compared to national stats</label><Form.Range className='formRange' onChange={handleCrimeNational} id='crimeNational' type='range' min='-1' max='1' /><br />

          <label>Crime compared to starting location</label><Form.Range className='formRange' onChange={handleCrimeCity} id='crimeCity' type='range' min='-1' max='1' /><br />
          
          <br /> <input type='button' value='Next' style={{width:'315px'}} onClick={()=>setIsVisible('travelSection')} />
          
        </div>}

      {isVisible == 'travelSection' && 
        <div id='travelSection'>
          <label>Travel time in minutes: </label><input style={{width:'147px'}} onChange={handleTravelTime} id='travelDuration' /><br />
          <label>Travel distance in miles: </label><input onChange={handleTravelDistance} id='travelDistance' style={{width:'139px'}} /><br />
          
          <br /><input type='button' value='Next' style={{width:'315px'}} onClick={()=>setIsVisible('weatherSection')} />
        </div>}

      {isVisible == 'weatherSection' && 
        <div id='weatherSection'>
          <label>Temperature difference</label><Form.Range className='formRange' onChange={handleTemperature} id='temperature' type='range' min='-1' max='1' /><br />
          <label>Weather to avoid:</label><br />
            <Form.Select multiple id='weatherDescriptors' onChange={handleWeatherDescriptors}>
              <option value='clear sky'>Clear</option>
              <option value='few clouds'>Few clouds</option>
              <option value='scattered clouds'>Scattered clouds</option>
              <option value='broken clouds'>Broken clouds</option>
              <option value='overcast clouds'>Overcast clouds</option>
              <option value='shower rain'>Rainshower</option>
              <option value='rain'>Rain</option>
              <option value='thunderstorm'>Thunderstorm</option>
              <option value='snow'>Snow</option>
              <option value='mist'>Mist</option>
            </Form.Select><br />
          
          <br /><input type='button' value='Next' style={{width:'315px'}} onClick={()=>setIsVisible('footTrafficSection')} />
        </div>}


      {isVisible == 'footTrafficSection' && 
        <div id='footTrafficSection'>
          <label>Foot traffic</label>
          
          <Form.Range className='formRange' onChange={handleFootTraffic} id='footTraffic' type='range' min='-2' max='2' /><br />

          <br /><input type='button' style={{width:'315px'}} onMouseEnter={updatePrefs} onClick={handleSubmitPrefs} value='Save' />
        </div>}

        
      </div>
      </div>
    </center>
  )
}