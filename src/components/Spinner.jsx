import { View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

const Spinner = () => {
  return (
    <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
      <LottieView
      style={{width:150, height:150}}
      source={require("../../assets/spinner.json")}
      autoPlay
      loop
      />
    </View>
  )
}

export default Spinner