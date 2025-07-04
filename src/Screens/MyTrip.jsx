import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ShowTripsCard from "../components/ShowTripsCard";
import HeaderWithSearch from "../components/HeaderWithSearch";
import { useUserTripsData } from "../utils/firebaseUserHandlers";
import { FlatList } from "react-native";
import Spinner from "../components/Spinner";

const MyTrip = () => {
  const [openModalId, setOpenModalId] = useState(null);
  const { tripsData, loading, error, tripIds } = useUserTripsData();
  
    const openMenu = (itemId) => setOpenModalId(itemId);
    const closeMenu = () => setOpenModalId(null);
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
            visible={openModalId === item.id}
            openModal = {() => openMenu(item.id)}
            closeModal={closeMenu}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default MyTrip;
