import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import { FontAwesome } from "@expo/vector-icons";
import SeparationLine from "./SeparationLine";
import { useAuth } from "../Context/AuthContext";

const HeaderWithSearch = ({ openDrawer, searchText, setSearchText }) => {
  const { userNameChars } = useAuth();
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
        <TouchableOpacity onPress={openDrawer} style={styles.userButton}>
          {userNameChars && userNameChars !== "U" ? (
            <Text
              style={{
                fontFamily: FONTS.medium,
                color: "#fff",
                fontSize: FONT_SIZE.body,
                paddingVertical: 1,
              }}
            >
              {userNameChars}
            </Text>
          ) : (
            <FontAwesome name="user-o" size={18} color="#fff" />
          )}
        </TouchableOpacity>
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
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
export default HeaderWithSearch;
