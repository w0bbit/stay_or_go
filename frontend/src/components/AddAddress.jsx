import axios from 'axios'
import getGas from '../helpers/getGas'

export default function AddAddress({handleGetAddresses}) {

  const getCoords = async address => {
    const response = await axios.post('api/get_data/', {
      'action': 'geocode',
      'address': address,})
    const lat = response.data.results.lat
    const lng = response.data.results.lng
    return([lat, lng])}

  const handleSaveAddress = async event => {
    event.preventDefault()
    const placename = document.getElementById('placename').value
    const street = document.getElementById('street').value
    const city = document.getElementById('city').value
    const state = document.getElementById('state').value
    const zip = document.getElementById('zip').value
    const notes = document.getElementById('notes').value
    const coords = await getCoords(`${street}, ${city}, ${state}, ${zip}`)
    const avgGas = await getGas(zip)
    const response = await axios.post('api/add_address/', {
      'placename': placename,
      'street': street,
      'city': city,
      'state': state,
      'zip': zip,
      'lat': coords[0],
      'lng': coords[1],
      'notes': notes,
      'avg_gas': String(avgGas),})
    handleGetAddresses()}

  return(
    <center>
      <div style={{width:'315px'}}>
        <input placeholder='Placename' id='placename' style={{width:'314px',marginTop:'5px'}} /><br />
        <input placeholder='Street' id='street' style={{width:'155px'}} />
        <input placeholder='City' id='city' style={{width:'155px',marginLeft:'5px'}} /><br />
        <select id='state' style={{width:'155px'}}>
          <option value="AL">Alabama</option>
          <option value="AK">Alaska</option>
          <option value="AZ">Arizona</option>
          <option value="AR">Arkansas</option>
          <option value="CA">California</option>
          <option value="CO">Colorado</option>
          <option value="CT">Connecticut</option>
          <option value="DE">Delaware</option>
          <option value="DC">District Of Columbia</option>
          <option value="FL">Florida</option>
          <option value="GA">Georgia</option>
          <option value="HI">Hawaii</option>
          <option value="ID">Idaho</option>
          <option value="IL">Illinois</option>
          <option value="IN">Indiana</option>
          <option value="IA">Iowa</option>
          <option value="KS">Kansas</option>
          <option value="KY">Kentucky</option>
          <option value="LA">Louisiana</option>
          <option value="ME">Maine</option>
          <option value="MD">Maryland</option>
          <option value="MA">Massachusetts</option>
          <option value="MI">Michigan</option>
          <option value="MN">Minnesota</option>
          <option value="MS">Mississippi</option>
          <option value="MO">Missouri</option>
          <option value="MT">Montana</option>
          <option value="NE">Nebraska</option>
          <option value="NV">Nevada</option>
          <option value="NH">New Hampshire</option>
          <option value="NJ">New Jersey</option>
          <option value="NM">New Mexico</option>
          <option value="NY">New York</option>
          <option value="NC">North Carolina</option>
          <option value="ND">North Dakota</option>
          <option value="OH">Ohio</option>
          <option value="OK">Oklahoma</option>
          <option value="OR">Oregon</option>
          <option value="PA">Pennsylvania</option>
          <option value="RI">Rhode Island</option>
          <option value="SC">South Carolina</option>
          <option value="SD">South Dakota</option>
          <option value="TN">Tennessee</option>
          <option value="TX">Texas</option>
          <option value="UT">Utah</option>
          <option value="VT">Vermont</option>
          <option value="VA">Virginia</option>
          <option value="WA">Washington</option>
          <option value="WV">West Virginia</option>
          <option value="WI">Wisconsin</option>
          <option value="WY">Wyoming</option>
        </select>
        <input placeholder='Zip code' id='zip' style={{width:'155px',marginLeft:'5px'}} /><br />
        <input placeholder='Notes' id='notes' style={{width:'314px',wordBreak:'break-word'}} /><br />
        <input style={{width:'314px'}} type='button' value='Save Address' onClick={handleSaveAddress} />
      </div>
      <hr />
    </center>
  )
}