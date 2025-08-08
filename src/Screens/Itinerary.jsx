import React from "react";
import JourneysList from "./itinerary/DayList";
import { StatusBar } from "expo-status-bar";

const Itinerary = ({ route }) => {
  const tripData = route.params;
  return <JourneysList tripData={tripData} />;
};

export default Itinerary;
