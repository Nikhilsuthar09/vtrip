import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ShowTripsCard from "./components/ShowTripsCard";
import HeaderWithSearch from "./components/HeaderWithSearch";
import { useUserTripsData } from "./utils/firebaseUserHandlers";
import { FlatList } from "react-native";

const MyTrip = () => {
  const {tripsData, loading, error, tripIds} = useUserTripsData()
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <HeaderWithSearch />
      <FlatList
      data={tripsData}
      renderItem={({item}) => 
        <ShowTripsCard
          title={item.title}
          destination={item.destination}
          startDate={item.startDate}
          endDate={item.endDate}
          budget={item.budget}
          />
        }
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

export default MyTrip;
