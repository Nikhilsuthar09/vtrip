import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ShowTripsCard from "../components/ShowTripsCard";
import HeaderWithSearch from "../components/HeaderWithSearch";
import { useUserTripsData } from "../utils/firebaseUserHandlers";
import { Alert, FlatList } from "react-native";
import Spinner from "../components/Spinner";
import TripMenuModal from "../components/TripMenuModal";
import AddTripModal from "../components/AddTripModal";
import EmptyTripsPlaceholder from "../components/EmptyTripsPlaceholder";

const MyTrip = () => {
  const [modalData, setModalData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editTripData, setEditTripData] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const { tripsData, loading, error, tripIds } = useUserTripsData();
  console.log(tripsData) 
  const safeTripData = tripsData || [];

  const filteredTrips =
    searchText.trim() === ""
      ? safeTripData
      : safeTripData.filter(
          (trip) =>
            trip.destination
              .toLowerCase()
              .includes(searchText.toLowerCase().trim()) ||
            trip.title.toLowerCase().includes(searchText.toLowerCase().trim())
        );

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
  const handleEditTrip = (id) => {
    console.log(id);
    const tripToEdit = safeTripData.find((trip) => trip.id === id);
    if (tripToEdit) {
      setEditTripData(tripToEdit);
      setIsEditModalVisible(true);
      closeMenu();
    }
  };
  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setEditTripData(null);
  };
   const handleAddTrip = () => {
    setIsAddModalVisible(true);
  };

  const closeAddModal = () => {
    setIsAddModalVisible(false);
  };
  const showPlaceholder = filteredTrips.length === 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop: 20 }}>
      <HeaderWithSearch searchText={searchText} setSearchText={setSearchText} />
      {showPlaceholder ? (
        <EmptyTripsPlaceholder
          searchText={searchText}
          onAddTrip={handleAddTrip}
        />
      ) : (
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
      )}
      <TripMenuModal
        visible={modalData?.visible || false}
        closeModal={closeMenu}
        position={modalData?.position}
        selectedId={modalData?.selectedItemId}
        isShareVisible={true}
        onDelete={handleDeleteTrip}
        onEdit={handleEditTrip}
      />
      <AddTripModal
        isModalVisible={isEditModalVisible}
        onClose={closeEditModal}
        onBackButtonPressed={closeEditModal}
        editTripData={editTripData}
        isEditMode={true}
      />
      <AddTripModal
        isModalVisible={isAddModalVisible}
        onClose={closeAddModal}
        onBackButtonPressed={closeAddModal}
        isEditMode={false}
      />
    </SafeAreaView>
  );
};

export default MyTrip;
