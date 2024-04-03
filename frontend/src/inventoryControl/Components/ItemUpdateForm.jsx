import React, { useState } from 'react'
import { Form, useNavigate } from 'react-router-dom'
import { Box, Button, Container, FormControl, FormLabel, Input, Select, Textarea, Image } from '@chakra-ui/react'

function ItemUpdateForm({ item }) {

    const pageNavigation = useNavigate()

    // States
    const [itemValues, setItemValues] = useState({
        itemPrice: item.itemPrice,
        stockCount: item.stockCount,
        itemDescription: item.itemDescription
    })

    // Extract itemValues properties to seperate variable
    const { itemPrice, stockCount, itemDescription } = itemValues

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newItemDetails = { itemPrice, stockCount, itemDescription }
        try {
            const response = await fetch(`/inventoryPanel/${item.itemID}`, {
                method: 'PATCH',
                body: JSON.stringify(newItemDetails),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()

            if (response.ok) {
                console.log(response.status + ': Update is successful', json)
                pageNavigation('/inventoryPanel')
            } else {
                console.log(response.status + ': Update is unsuccessful')
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Container>
                <Box maxWidth='480px' marginBottom='44px' paddingTop='24px' paddingBottom='24px'>

                    <div className='update-form-img-preview'>
                        <Image
                            src={`${item.imgURL}`}
                            boxSize='200px'
                            objectFit='cover'
                        />
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <FormControl marginBottom='12px'>
                            <FormLabel>Item ID</FormLabel>
                            <Input
                                type='text'
                                name='itemID'
                                defaultValue={item.itemID}
                                readOnly
                            />
                        </FormControl>

                        <FormControl marginBottom='12px'>
                            <FormLabel>Item Name</FormLabel>
                            <Input
                                type='text'
                                name='itemName'
                                defaultValue={item.itemName}
                                readOnly
                            />
                        </FormControl>

                        <FormControl marginBottom='12px'>
                            <FormLabel>Item Brand</FormLabel>
                            <Input
                                type='text'
                                name='itemBrand'
                                defaultValue={item.itemBrand}
                                readOnly
                            />
                        </FormControl>

                        <FormControl marginBottom='12px' isRequired>
                            <FormLabel>Item Price</FormLabel>
                            <Input
                                type='number'
                                name='itemPrice'
                                defaultValue={item.itemPrice}
                                onChange={(e) => setItemValues({
                                    ...itemValues,
                                    itemPrice: e.target.value
                                })}
                            />
                        </FormControl>

                        <FormControl marginBottom='12px' isRequired>
                            <FormLabel>Stock Count</FormLabel>
                            <Input
                                type='number'
                                name='stockCount'
                                defaultValue={item.stockCount}
                                onChange={(e) => setItemValues({
                                    ...itemValues,
                                    stockCount: e.target.value
                                })}
                            />
                        </FormControl>

                        <FormControl marginBottom='12px'>
                            <FormLabel>Select a catagory</FormLabel>
                            <Select
                                placeholder='Catagory'
                                value={item.catagory}
                                readOnly
                            >
                                <option value='smartphone'>Smartphone</option>
                                <option value='smartwatch'>Smart Watch</option>
                            </Select>
                        </FormControl>

                        <FormControl marginBottom='12px'>
                            <FormLabel>Select a warranty</FormLabel>
                            <Select
                                placeholder='Warranty Periode'
                                value={item.warranty}
                                readOnly
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
                                defaultValue={item.itemDescription}
                                onChange={(e) => setItemValues({
                                    ...itemValues,
                                    itemDescription: e.target.value
                                })}
                            />
                        </FormControl>

                        <Button type='submit' colorScheme='blue'>Save Changes</Button>
                    </Form>
                </Box>
            </Container>
        </>
    )
}

export default ItemUpdateForm