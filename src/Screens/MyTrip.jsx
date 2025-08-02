import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ShowTripsCard from "../components/ShowTripsCard";
import HeaderWithSearch from "../components/HeaderWithSearch";
import { useUserTripsData } from "../utils/firebaseUserHandlers";
import { Alert, FlatList } from "react-native";
import Spinner from "../components/Spinner";
import TripMenuModal from "../components/TripMenuModal";

const MyTrip = () => {
  const [modalData, setModalData] = useState(null);
  const { tripsData, loading, error, tripIds } = useUserTripsData();
  const [searchText, setSearchText] = useState("");
  const safeTripData = tripsData || [];

    const filteredTrips = searchText.trim === "" ?
     safeTripData : 
     safeTripData.filter(trip => 
      trip.destination.toLowerCase().includes(searchText.toLowerCase().trim()) || 
      trip.title.toLowerCase().includes(searchText.toLowerCase().trim())
    )

  const openMenu = (position) => {
    setModalData({
      visible: true,
      position,
      selectedItemId: position.itemId,
    });
  };
  const closeMenu = () => setModalData(null);
  if (loading) {
    return <Spinner />;
  }
  if (error) {
    console.log(error);
  }
  // to do
  const deleteTrip = () => {
    console.log("ToDo");
  };
  const handleDeleteTrip = () => {
    Alert.alert(
      "Are you sure?",
      `Do you want to delete ?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Ok",
          onPress: () => {
            deleteTrip();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop: 20 }}>
      <HeaderWithSearch 
      searchText = {searchText}
      setSearchText = {setSearchText}
      />
      <FlatList
        data={filteredTrips}
        renderItem={({ item }) => (
          <ShowTripsCard
            id={item.id}
            title={item.title}
            destination={item.destination}
            startDate={item.startDate}
            endDate={item.endDate}
            budget={item.budget}
            openModal={openMenu}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <TripMenuModal
        visible={modalData?.visible || false}
        closeModal={closeMenu}
        position={modalData?.position}
        selectedId={modalData?.selectedItemId}
        isShareVisible={true}
        onDelete={handleDeleteTrip}
      />
    </SafeAreaView>
  );
};

export default MyTrip;
