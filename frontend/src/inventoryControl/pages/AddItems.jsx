import React, { useState } from 'react'
import { Box, Button, Container, FormControl, FormHelperText, FormLabel, Input, Select, Textarea } from '@chakra-ui/react'
import { Form } from 'react-router-dom'
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'

// Components
import SlideBar from '../Components/SlideBar'

function AddItems() {
  // variable for store image download URL
  var imgURL;

  // use states
  const [itemImage, setItemImage] = useState('')
  const [itemID, setItemID] = useState('')
  const [itemName, setItemName] = useState('')
  const [itemBrand, setItemBrand] = useState('')
  const [itemPrice, setItemPrice] = useState(0)
  const [stockCount, setStockCount] = useState(0)
  const [catagory, setCatagory] = useState('')
  const [warranty, setWarranty] = useState('')
  const [itemDescription, setItemDescription] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    imgURL = await imageUpload()

    // get all the user input fields values and assign them to a new object called newItem
    const newItem = { itemID, itemName, itemBrand, itemPrice, stockCount, catagory, warranty,itemDescription, imgURL }

    const response = await fetch('/inventoryPanel/addItems', {
      method: 'POST',
      body: JSON.stringify(newItem), // convert newItem to string
      headers: { 'Content-Type': 'application/json' }
    })
    const json = await response.json()

    // for handling errors
    if(!response.ok) {
      setError(json.error)
      console.log('There is some error while adding items to database!')
    }

    if(response.ok) {
      setItemImage('')
      setItemID('')
      setItemName('')
      setItemBrand('')
      setItemPrice(0)
      setStockCount(0)
      setCatagory('')
      setWarranty('')
      setItemDescription('')
      setError(null)
      console.log('A new item added!', json)
    }
  }

  // item image upload function
  const imageUpload = async () => {
    // make image store location and make image name unique
    const imageRef = ref(storage, `images/${itemImage.name + v4()}`)
    
    try {
      // send image to firebase
      await uploadBytes(imageRef, itemImage)
      // get image url from firebase
      const downloadImageURL = await getDownloadURL(imageRef)
      imgURL = downloadImageURL
      console.log(imgURL)
      return imgURL
    
    } catch (error) {
      console.log('Error uploading image: ', error)
    }
  }

  return (
    <>
      <SlideBar />
      <Container>
        <Box maxWidth='480px' marginBottom='44px' paddingTop='24px' paddingBottom='24px'>
          <Form onSubmit={handleSubmit}>
            <FormControl marginBottom='12px' isRequired>
              <FormLabel>Add an image</FormLabel>
              <Input 
                type='file' 
                name='image'
                accept='image/jpeg, image/png'
                onChange={(e) => setItemImage(e.target.files[0])}
                 />
              <FormHelperText>Only JPEG and PNG files</FormHelperText>
            </FormControl>
            
            <FormControl marginBottom='12px' isRequired>
              <FormLabel>Item ID</FormLabel>
              <Input 
                placeholder='ID001' 
                type='text' 
                name='itemID'
                value = {itemID}
                onChange={(e) => setItemID(e.target.value)}
              />
            </FormControl>

            <FormControl marginBottom='12px' isRequired>
              <FormLabel>Item Name</FormLabel>
              <Input 
                type='text' 
                name='itemName' 
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </FormControl>

            <FormControl marginBottom='12px' isRequired>
              <FormLabel>Item Brand</FormLabel>
              <Input 
                type='text' 
                name='itemBrand' 
                value={itemBrand}
                onChange={(e) => setItemBrand(e.target.value)}
              />
            </FormControl>

            <FormControl marginBottom='12px' isRequired>
              <FormLabel>Item Price</FormLabel>
              <Input 
                type='number' 
                name='itemPrice' 
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
              />
            </FormControl>

            <FormControl marginBottom='12px' isRequired>
              <FormLabel>Stock Count</FormLabel>
              <Input 
                type='number' 
                name='stockCount'
                value={stockCount}
                onChange={(e) => setStockCount(e.target.value)} 
              />
            </FormControl>

            <FormControl marginBottom='12px' isRequired>
              <FormLabel>Select a catagory</FormLabel>
              <Select 
                placeholder='Catagory'
                value={catagory}
                onChange={(e) => setCatagory(e.target.value)}
              >
                <option value='smartphone'>Smartphone</option>
                <option value='smartwatch'>Smart Watch</option>
              </Select>
            </FormControl>

            <FormControl marginBottom='12px'>
              <FormLabel>Select a warranty</FormLabel>
              <Select 
                placeholder='Warranty Periode'
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
              >
                <option value='noWarranty'>0</option>
                <option value='sixMonths'>6 Months</option>
                <option value='oneYear'>1 Year</option>
                <option value='twoYear'>2 Year</option>
              </Select>
            </FormControl>

            <FormControl marginBottom='12px'>
              <FormLabel>Item Description</FormLabel>
              <Textarea 
                placeholder='Enter detailed description about the item' 
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              />
            </FormControl>

            <Button type='submit' colorScheme='blue' onClick={imageUpload}>Add</Button>
          </Form>
        </Box>
      </Container>
    </>
  )
}

export default AddItems