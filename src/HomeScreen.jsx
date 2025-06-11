import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { auth } from '../firebaseConfig'
import { signOut } from '@firebase/auth';

const handlelogout = async() => {
  try{
    await signOut(auth);
    console.log("user signed out ")
  }
  catch(e){
    console.error(e)
  }
}

const HomeScreen = () => {
  return (
    <View>
      <Pressable onPress={handlelogout}>
      <Text>logout</Text>
      </Pressable>
    </View>
  )
}

export default HomeScreen