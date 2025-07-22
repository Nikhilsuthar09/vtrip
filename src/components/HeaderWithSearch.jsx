import { View, StyleSheet, Pressable, TextInput } from "react-native";
import React, { useState } from "react";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import SeparationLine from "./SeparationLine";

const HeaderWithSearch = ({ onSearch, onBack }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text) => {
    setSearchText(text);
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search destination..."
            placeholderTextColor={COLOR.placeholder}
            value={searchText}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
            />
          <FontAwesome name="search" size={18} color={COLOR.grey} />
        </View>
            <Pressable style={styles.userButton} onPress={onBack}>
              <FontAwesome name="user-o" size={18} color="#fff" />
            </Pressable>
      </View>
      <SeparationLine/>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.stroke,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    height: 45,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.body,
    color: COLOR.textPrimary,
    fontFamily: FONTS.regular,
    height: "100%",
    marginRight: 8,
  },
  userButton:{
    backgroundColor:COLOR.primary,
    paddingVertical:9,
    paddingHorizontal:11,
    borderRadius:20
  }
});
export default HeaderWithSearch;
