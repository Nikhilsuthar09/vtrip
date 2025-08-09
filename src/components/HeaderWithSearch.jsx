import { View, StyleSheet, Pressable, TextInput, Text } from "react-native";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import { FontAwesome } from "@expo/vector-icons";
import SeparationLine from "./SeparationLine";
import { getAuth } from "firebase/auth";

const HeaderWithSearch = ({ searchText, setSearchText }) => {
  const auth = getAuth();
  const name = auth?.currentUser?.displayName;
  const cleanedName = name.trim().replace(/\s+/g, " ");
  const splitted = cleanedName.split(" ");
  const userNameChars = splitted[0][0] + splitted[splitted.length - 1][0];
  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search destination..."
            placeholderTextColor={COLOR.placeholder}
            value={searchText}
            onChangeText={(value) => setSearchText(value)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <FontAwesome name="search" size={18} color={COLOR.grey} />
        </View>
        <Pressable style={styles.userButton}>
          {name ? (
            <Text style={{fontFamily:FONTS.medium, color:"#fff", fontSize:FONT_SIZE.body, paddingVertical:1}} >{userNameChars}</Text>
          ) : (
            <FontAwesome name="user-o" size={18} color="#fff" />
          )}
        </Pressable>
      </View>
      <SeparationLine />
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
  userButton: {
    backgroundColor: COLOR.primary,
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 20,
  },
});
export default HeaderWithSearch;
