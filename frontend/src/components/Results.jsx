import {useState} from 'react'

export default function Results({originAddress, destinationAddress, prefs, travelTime, travelDistance, destinationFootTraffic, originWeather, destinationWeather}) {

  const [showGas, setShowGas] = useState(false)

  let weight = 0
  let blufStatement = ['', '']
  let cityCrimeStatement = ['', '']
  let nationCrimeStatement = ['', '']
  let travelTimeStatement = ['', '']
  let travelDistanceStatement = ['', '']
  let weatherStatement = ['', '']
  let tempStatement = ['', '']
  let footTrafficStatement = ['', '']

  // city crime
  if (originAddress.city_crime < destinationAddress.city_crime) {
    cityCrimeStatement[0] = 'You are more likely to be the victim of a violent crime at ' + destinationAddress.placename + '.'
    if (prefs.crime_city < 0) {
      cityCrimeStatement[1] = -1
      weight--
    } else if (prefs.crime_city > 0) {
      cityCrimeStatement[1] = 1
      weight++
    } else {
      cityCrimeStatement[1] = -1
      weight--
    }
  } else if (originAddress.city_crime > destinationAddress.city_crime) {
    cityCrimeStatement[0] = 'You are less likely to be the victim of a violent crime at ' + destinationAddress.placename + '.'
    if (prefs.crime_city > 0) {
      cityCrimeStatement[1] = -1
      weight--
    } else if (prefs.crime_city < 0) {
      cityCrimeStatement[1] = 1
      weight++
    } else {
      cityCrimeStatement[1] = -1
      weight--
    }
  } else {
    cityCrimeStatement[0] = 'You are just as likely to be the victim of a violent crime at ' + destinationAddress.placename + '.'
    if (prefs.crime_city == 0) {
      cityCrimeStatement[1] = 1
      weight++
    } else {
      cityCrimeStatement[1] = -1
      weight--
    }
  }
  // nation crime
  if (destinationAddress.city_crime < destinationAddress.nation_crime) {
    nationCrimeStatement[0] = 'You are less likely to be the victim of a violent crime at ' + destinationAddress.placename + ' than in most other places in the country.'
    if (prefs.crime_national < 0) {
      nationCrimeStatement[1] = 1
      weight++
    } else if (prefs.crime_national > 0) {
      nationCrimeStatement[1] = -1
      weight--
    } else {
      nationCrimeStatement[1] = -1
      weight--
    }
  } else if (destinationAddress.city_crime > destinationAddress.nation_crime) {
    nationCrimeStatement[0] = 'You are more likely to be the victim of a violent crime at ' + destinationAddress.placename + ' than in most other places in the country.'
    if (prefs.crime_national < 0) {
      nationCrimeStatement[1] = -1
      weight--
    } else if (prefs.crime_national > 0) {
      nationCrimeStatement[1] = 1
      weight++
    } else {
      nationCrimeStatement[1] = -1
      weight--
    }
  } else {
    nationCrimeStatement[0] = 'You are just as likely to be the victim of a violent crime at ' + destinationAddress.placename + ' as you are in most other places in the country.'
    if (prefs.crime_national < 0) {
      nationCrimeStatement[1] = -1
      weight--
    } else if (prefs.crime_national > 0) {
      nationCrimeStatement[1] = -1
      weight--
    } else {
      nationCrimeStatement[1] = 1
      weight++
    }
  }

  // travel time
  let travelTimeMins = 0
  if (/hour/.test(travelTime)) {
    let hours = travelTime.match(/(\d+)\shour/)[1]
    travelTimeMins += hours * 60
    if (/min/.test(travelTime)) {
      let mins = travelTime.match(/(\d+)\smin/)[1]
      travelTimeMins += mins
    }
  } else {
    travelTimeMins += parseInt(travelTime)
  }

  if (prefs.travel_time >= travelTimeMins) {
    travelTimeStatement[0] = 'Travel time is only ' + travelTime + '.'
    travelTimeStatement[1] = 1
    weight++
  } else if (prefs.travel_time < travelTimeMins) {
    travelTimeStatement[0] = 'Travel time is ' + travelTime + '.'
    travelTimeStatement[1] = -1
    weight--
  }

  // travel distance
  if (prefs.travel_distance >= travelDistance) {
    travelDistanceStatement[0] = 'Travel distance is only ' + travelDistance + ' miles.'
    travelDistanceStatement[1] = 1
    weight++
  } else if (prefs.travel_distance < travelDistance) {
    travelDistanceStatement[0] = 'Travel distance is ' + travelDistance + ' miles.'
    travelDistanceStatement[1] = -1
    weight--
  }

  // weather
  if (prefs.weather_descriptors.includes(destinationWeather[0])) {
    weatherStatement[0] = 'The weather at ' + destinationAddress.placename + ' includes ' + destinationWeather[0] + '.'
    weatherStatement[1] = -1
    weight--
  } else {
    weatherStatement[0] = 'The weather at ' + destinationAddress.placename + ' includes ' + destinationWeather[0] + '.'
    weatherStatement[1] = 1
    weight++
  }

  // temp
  if (originWeather[1] < destinationWeather[1]) {
    tempStatement[0] = 'It is colder at ' + destinationAddress.placename + '.'
    if (prefs.temperature > 0) {
      tempStatement[1] = -1
      weight--
    } else if (prefs.temperature < 0) {
      tempStatement[1] = 1
      weight++
    } else {
      tempStatement[1] = -1
      weight--
    }
  } else if (originWeather[1] > destinationWeather[1]) {
    tempStatement[0] = 'It is warmer at ' + destinationAddress.placename + '.'
    if (prefs.temperature > 0) {
      tempStatement[1] = 1
      weight++
    } else if (prefs.temperature < 0) {
      tempStatement[1] = -1
      weight--
    } else {
      tempStatement[1] = -1
      weight--
    }
  } else {
    tempStatement[0] = 'The temperatures are similar at ' + originAddress.placename + ' and ' + destinationAddress.placename + '.'
    if (prefs.temperature > 0) {
      tempStatement[1] = -1
      weight--
    } else if (prefs.temperature < 0) {
      tempStatement[1] = -1
      weight--
    } else {
      tempStatement[1] = 1
      weight++
    }
  }

  // foottraffic
  footTrafficStatement[0] = 'The foot traffic at ' + destinationAddress.placename + ' is ' + destinationFootTraffic + '.'
  if (destinationFootTraffic == 'unknown') {
    footTrafficStatement[1] = 0
  } else if (destinationFootTraffic == 'high') {
    if (prefs.foot_traffic == 2) {
      footTrafficStatement[1] = 1
      weight++
    } else {
      footTrafficStatement[1] = -1
      weight--
    }
  } else if (destinationFootTraffic == 'above average') {
    if (prefs.foot_traffic >= 1) {
      footTrafficStatement[1] = 1
      weight++
    } else {
      footTrafficStatement[1] = -1
      weight--
    }
  } else if (destinationFootTraffic == 'average') {
    if (prefs.foot_traffic >= 0) {
      footTrafficStatement[1] = 1
      weight++
    } else {
      footTrafficStatement[1] = -1
      weight--
    }
  } else if (destinationFootTraffic == 'below average') {
    if (prefs.foot_traffic >= -1) {
      footTrafficStatement[1] = 1
      weight++
    } else {
      footTrafficStatement[1] = -1
      weight--
    }
  } else if (destinationFootTraffic == 'low') {
    if (prefs.foot_traffic >= -2) {
      footTrafficStatement[1] = 1
      weight++
    } else {
      footTrafficStatement[1] = -1
      weight--
    }
  }

  if (weight > 1) {
    blufStatement[0] = 'it is a good time to go to ' + destinationAddress.placename + ' from ' + originAddress.placename + '.'
    blufStatement[1] = 1
  } else if (weight < 1 ){
    blufStatement[0] = 'it is a bad time to go to ' + destinationAddress.placename + ' from ' + originAddress.placename + '.'
    blufStatement[1] = -1
  } else {
    blufStatement[0] = 'it is tough to decide. But consider that the current average cost of gas per gallon in your area is $' + originAddress.avg_gas + '.'
    blufStatement[1] = 0
  }

  return(
    <center>

      <div style={{width:'315px',textAlign:'left'}}>

      {originAddress.id && destinationAddress.id && Object.keys(prefs).length > 0 ? 
        <>
          <br />
          {/* Score: {weight}<br /> */}
          <div style={{border:'1px solid white',borderRadius:'5px',backgroundColor:'gray',color:'white',padding:'5px'}}>Based on your preferences, {blufStatement[0]}</div><div onClick={()=>setShowGas(!showGas)} ><br /><br /></div>
          ({nationCrimeStatement[1]}) {nationCrimeStatement[0]}<br />
          ({cityCrimeStatement[1]}) {cityCrimeStatement[0]}<br />
          ({travelTimeStatement[1]}) {travelTimeStatement[0]}<br />
          ({travelDistanceStatement[1]}) {travelDistanceStatement[0]}<br />
          ({weatherStatement[1]}) {weatherStatement[0]}<br />
          ({tempStatement[1]}) {tempStatement[0]}<br />
          ({footTrafficStatement[1]}) {footTrafficStatement[0]}<br />
          
          {showGas && <p>Also consider that the average gas price in your area is ${originAddress.avg_gas}/gal.</p>}
          
        </>
        :
        <p>You must set your origin address, destination address, and preferences.</p>
      }
      </div>

    </center>
  )
}
