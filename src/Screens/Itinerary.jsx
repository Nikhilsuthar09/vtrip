import { View, Text } from 'react-native'
import React from 'react'
import JourneysList from './expenses/itinerary/DayList'

const Itinerary = ({route}) => {
  const tripData = route.params
  return (
      <JourneysList tripData={tripData}/>

  )
}

export default Itinerary