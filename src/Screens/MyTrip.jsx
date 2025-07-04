import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ShowTripsCard from "../components/ShowTripsCard";
import HeaderWithSearch from "../components/HeaderWithSearch";
import { useUserTripsData } from "../utils/firebaseUserHandlers";
import { FlatList } from "react-native";
import Spinner from "../components/Spinner";

const MyTrip = () => {
  const { tripsData, loading, error, tripIds } = useUserTripsData();
  if (loading) {
    return <Spinner />;
  }
  if (error) {
    console.log(error);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <HeaderWithSearch />
      <FlatList
        data={tripsData}
        renderItem={({ item }) => (
          <ShowTripsCard
            title={item.title}
            destination={item.destination}
            startDate={item.startDate}
            endDate={item.endDate}
            budget={item.budget}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default MyTrip;
