import {Button, ListGroup} from 'react-bootstrap';
import {useEffect, useState} from 'react'
import axios from 'axios'
import './App.css'
import Welcome from './pages/Welcome'
import AddAddress from './components/AddAddress'
import AddressList from './components/AddressList'
import SetPrefs from './components/SetPrefs'
import Results from './components/Results'
import About from './components/About'
import RecentQueries from './components/RecentQueries'
import SearchNearby from './components/SearchNearby'
import NoResults from './components/NoResults';

const getCookie = name => {
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
              break}}}
  return cookieValue}
const csrftoken = getCookie('csrftoken')
axios.defaults.headers.common['X-CSRFToken'] = csrftoken

const currentHour = new Date().toLocaleTimeString('en-US', {hour12: false}).match(/\d+/)[0]

export default function App() {

  const [isSignedIn, setIsSignedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [originAddress, setOriginAddress] = useState({})
  const [destinationAddress, setDestinationAddress] = useState({})
  const [showAbout, setShowAbout] = useState(true)
  const [showCompare, setShowCompare] = useState(false)
  const [showAddresses, setShowAddresses] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [showSearchNearby, setShowSearchNearby] = useState(false)
  const [showRecentQueries, setShowRecentQueries] = useState(false)  
  const [showNoResults, setShowNoResults] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [activeAddress, setActiveAddress] = useState({})
  const [prefs, setPrefs] = useState({})
  const [travelTime, setTravelTime] = useState(null)
  const [travelDistance, setTravelDistance] = useState(null)
  const [destinationFootTraffic, setDestinationFootTraffic] = useState(null)
  const [originWeather, setOriginWeather] = useState([])
  const [destinationWeather, setDestinationWeather] = useState([])

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
    setDestinationWeather(await getWeather(destinationAddress))}

  const handleFootTraffic = () => {
    try {
      const footTraffic = JSON.parse(destinationAddress.foot_traffic)
      const currentFootTraffic = footTraffic.filter(data => data.hour == currentHour)[0]
      setDestinationFootTraffic(currentFootTraffic.intensity_txt.toLowerCase())
    } catch {
      setDestinationFootTraffic('unknown')
    }
  }

  const handleTravelMetrics = async () => {
    const [o, d] = [originAddress, destinationAddress]
    const response = await axios.post('api/get_data/', {
      'action': 'travel',
      'originAddress': `${o.street}, ${o.city}, ${o.state} ${o.zip}`,
      'destinationAddress': `${d.street}, ${d.city}, ${d.state} ${d.zip}`,})
    setTravelDistance(response.data.results.distance)
    setTravelTime(response.data.results.duration)}

  const getPrefs = async () => {
    const response = await axios.get('api/view_prefs/')
    const preferences = response.data
    setPrefs({
      id: preferences.id,
      crime_national: preferences.crime_national,
      crime_city: preferences.crime_city,
      travel_time: preferences.travel_time,
      travel_distance: preferences.travel_distance,
      temperature: preferences.temperature,
      weather_descriptors: preferences.weather_descriptors,
      foot_traffic: preferences.foot_traffic,
    })
    console.log(prefs)
  }

  useEffect(getPrefs, [])

  const handleGetAddresses = async () => {
    const response = await axios.get('api/view_addresses/')
    const items = []
    for (let item of response.data.addresses) {
      let currentFootTraffic = null
      if (item.foot_traffic){
        const footTraffic = JSON.parse(item.foot_traffic)
        currentFootTraffic = footTraffic.filter(data => data.hour == currentHour)[0]}
      items.push(
        <>
          <ListGroup.Item style={{border:'1px solid lightgray',borderRadius:'2px'}} className='address-list-item' onClick={()=>handleActive(item)}>
            <strong>{item.placename}</strong>: {item.street}, {item.city}, {item.state} {item.zip}
          </ListGroup.Item>
        </>)}
    setAddresses(items)}

  const handleActive = obj => setActiveAddress(obj)

  const handleSignOut = async (event) => {
    axios.post('handleSignout/')
    setIsSignedIn(false)
    setUser(null)
    location.reload()}

  const changeContentTitle = title => {
    const contentTitle = document.getElementById('content-title')
    contentTitle.innerHTML = title
  }

  const handleUserTextMouseEnter = () => {
    const userText = document.getElementById('user-text')
    userText.innerHTML = 'Log out'
  }

  const handleUserTextMouseLeave = () => {
    const userText = document.getElementById('user-text')
    userText.innerHTML = user
  }

  const handleClickAbout = () => {
    changeContentTitle('About')
    setShowAbout(true)
    setShowCompare(false)
    setShowAddresses(false)
    setShowPreferences(false)
    setShowSearchNearby(false)
    setShowRecentQueries(false)
    setShowNoResults(false)
  }

  const handleClickCompare = () => {
    if (Object.keys(prefs).length > 1 && originAddress && destinationAddress) {
      changeContentTitle('Compare Two Places')
      getPrefs()
      handleTravelMetrics()
      handleWeather()
      handleFootTraffic()
      setShowAbout(false)
      setShowCompare(true)
      setShowAddresses(false)
      setShowPreferences(false)
      setShowSearchNearby(false)
      setShowRecentQueries(false)
      setShowNoResults(false)
    } else {
      changeContentTitle('Nothing to compare...')
      setShowAbout(false)
      setShowCompare(false)
      setShowNoResults(true)
      setShowAddresses(false)
      setShowPreferences(false)
      setShowSearchNearby(false)
      setShowRecentQueries(false)
    }
  }

  const handleClickAddresses = () => {
    changeContentTitle('Addresses')
    setShowAbout(false)
    setShowCompare(false)
    setShowAddresses(true)
    setShowPreferences(false)
    setShowSearchNearby(false)
    setShowRecentQueries(false)
    setShowNoResults(false)
    handleGetAddresses()
  }

  const handleClickPreferences = () => {
    changeContentTitle('Preferences')
    setShowAbout(false)
    setShowCompare(false)
    setShowAddresses(false)
    setShowPreferences(true)
    setShowSearchNearby(false)
    setShowRecentQueries(false)
    setShowNoResults(false)
  }

  const handleClickSearchNearby = () => {
    changeContentTitle('Search Nearby')
    setShowAbout(false)
    setShowCompare(false)
    setShowAddresses(false)
    setShowPreferences(false)
    setShowSearchNearby(true)
    setShowRecentQueries(false)
    setShowNoResults(false)
  }

  const handleClickRecentQueries = () => {
    changeContentTitle('Recent Queries')
    setShowAbout(false)
    setShowCompare(false)
    setShowAddresses(false)
    setShowPreferences(false)
    setShowSearchNearby(false)
    setShowRecentQueries(true)
    setShowNoResults(false)
  }

  return (
    <div className="App">
      <>

      {!isSignedIn && <Welcome setIsSignedIn={setIsSignedIn} setUser={setUser} />}
      {isSignedIn && 
        <>
          <div className='content'>

            <div className='header'>
              <p>Stay or Go: A Simple App To Help You Decide</p>
            </div>

            <div className='left-main-title'>
              <p id='user-text' onMouseEnter={handleUserTextMouseEnter} onMouseLeave={handleUserTextMouseLeave} value={user} onClick={handleSignOut}>{user}</p>
            </div>

            <div className='left-main-content'>
              <Button onClick={handleClickAbout} style={{marginBottom:'10px'}} >About</Button><br />
              <Button onClick={handleClickPreferences} style={{marginBottom:'10px'}}>Preferences</Button><br />
              <Button onClick={handleClickAddresses} style={{marginBottom:'10px'}}>Addresses</Button><br />
              <Button onClick={handleClickCompare} style={{marginBottom:'10px'}}>Compare</Button><br />
              <Button onClick={handleClickSearchNearby} style={{marginBottom:'10px'}}>Search Nearby</Button><br />
              <Button onClick={handleClickRecentQueries} style={{marginBottom:'10px'}}>Recent Queries</Button>
            </div>

            <div className='right-main-title'>
              <p id='content-title'>About</p>
            </div>
            <div className='right-main-content'>

              {showAbout && <About />}

              {showCompare && 
                <>
                  <Results originAddress={originAddress} destinationAddress={destinationAddress} prefs={prefs} currentHour={currentHour} travelTime={travelTime} travelDistance={travelDistance} destinationFootTraffic={destinationFootTraffic} originWeather={originWeather} destinationWeather={destinationWeather} />
                </>
              }

              {showNoResults && <NoResults />}
              
              {showAddresses &&
                <>
                  <AddAddress handleGetAddresses={handleGetAddresses} />
                  <AddressList currentHour={currentHour} originAddress={originAddress} setOriginAddress={setOriginAddress} destinationAddress={destinationAddress} setDestinationAddress={setDestinationAddress} handleGetAddresses={handleGetAddresses} addresses={addresses} setAddresses={setAddresses} activeAddress={activeAddress} setActiveAddress={setActiveAddress}/>
                </>
              }
              
              {showPreferences &&
                <>
                  <SetPrefs resetPrefs={setPrefs} />
                </>
              }

              {showSearchNearby && 
                <SearchNearby />
              }
              
              {showRecentQueries &&
                <RecentQueries />
              }

            </div>
          </div>
        </>}
      </>
    </div>
  )
}