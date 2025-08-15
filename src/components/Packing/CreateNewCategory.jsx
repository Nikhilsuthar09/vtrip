import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import Modal from "react-native-modal";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import AntDesign from "@expo/vector-icons/AntDesign";

const CreateNewCategory = ({ isNewCategoryModalVisible, onCloseModal, input, setInput, onAdd }) => {

  return (
    <Modal
      isVisible={isNewCategoryModalVisible}
      onBackButtonPress={onCloseModal}
      onBackdropPress={onCloseModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.closeButtonWrapper}>
            <AntDesign
              onPress={onCloseModal}
              name="close"
              size={24}
              color={COLOR.primary}
            />
          </View>
          <View style={styles.inputcontainer}>
            <Text style={styles.label}>Enter new Category</Text>
            <TextInput
              placeholder="eg snacks"
              placeholderTextColor={COLOR.placeholder}
              style={styles.newCategoryInput}
              onChangeText={(value) => setInput(value)}
              value={input}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Pressable style={styles.buttonContainer} onPress={onAdd}>
              <Text style={styles.buttonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: wp(80),
    height: hp(30),
    borderRadius: 10,
    padding: 20,
    justifyContent: "space-between",
  },
  inputcontainer: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.body,
    color: COLOR.grey,
    marginBottom: 2,
  },
  newCategoryInput: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.body,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  buttonWrapper: {
    alignItems: "flex-end",
  },
  buttonContainer: {
    backgroundColor: COLOR.primary || "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.body,
  },
  closeButtonWrapper: {
    alignItems: "flex-end",
    marginBottom: 5,
  },
});
export default CreateNewCategory;
