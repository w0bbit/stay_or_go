import {useState} from 'react'
import axios from 'axios'
import {ListGroup} from 'react-bootstrap'

export default function AddressList({currentHour, originAddress, setOriginAddress, destinationAddress, setDestinationAddress, handleGetAddresses, addresses, setAddresses, activeAddress, setActiveAddress, handleClickAddresses}) {

  const [showUpdate, setShowUpdate] = useState(false)

  const updateUserLastOrigin = async address => {
    const address_id = address.id
    const response = await axios.put('set_origin/', {
      'address_id': address_id
    })}

  const handleOriginClick = obj => {
    setOriginAddress(obj)
    updateUserLastOrigin(obj)
  }

  const handleDestinationClick = obj => setDestinationAddress(obj)

  const handleAddressUpdate = event => {
    if (addresses.length > 0) {
      setShowUpdate(!showUpdate)
    } else {
      console.log('no address to update')
    }}

  const handleSaveUpdate = async () => {
    const updatedNotes = document.getElementById('notesUpdate').value || document.getElementById('notesUpdate').placeholder
    setActiveAddress({'id': activeAddress.id, 'notes': updatedNotes,})
    const response = await axios.put('api/update_address/', {
      'address_id': activeAddress.id,
      'notes': updatedNotes,})
    if (activeAddress.id == originAddress.id) {
      setOriginAddress(activeAddress)
    } else if (activeAddress.id == destinationAddress.id) {
      setDestinationAddress(activeAddress)
    }
    setShowUpdate(!showUpdate)
    handleGetAddresses()}

  const handleAddressDelete = async (event) => {
    event.preventDefault()
    const response = await axios.post('api/update_address/', {
      'address_id': activeAddress.id,})
    handleGetAddresses()}

  return(
    <center>
      <div style={{width:'315px',textAlign:'left'}} >

      <div style={{textAlign:'center',paddingBottom:'5px'}}>
        <input type='button' value='Set Origin' onClick={()=>handleOriginClick(activeAddress)} style={{width:'78px'}} />
        <input type='button' value='Set Destination' onClick={()=>handleDestinationClick(activeAddress)} style={{width:'105px'}} />
        <input type='button' value='See Notes' onClick={handleAddressUpdate} style={{width:'77px'}} />
        <input type='button' value='Delete' onClick={handleAddressDelete} style={{width:'55px'}} /><br />
      </div>

      {showUpdate &&
        <>
          <input type='text' className='notes-input' id='notesUpdate' placeholder={activeAddress.notes} style={{width:'285px',marginBottom:'5px'}} />
          <input type='button' style={{width:'30px'}} id='saveUpdate' value='&#x2713;' onClick={handleSaveUpdate} />
        </>
      }

      {addresses.length > 0 && 
        <ListGroup className='address-list'>
          {addresses}
        </ListGroup>
      }
      </div>
    </center>
  )
}