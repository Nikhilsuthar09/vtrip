import { View, Text, StyleSheet, Pressable } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import Checkbox from "expo-checkbox";

const PackingListCard = ({ title, data, toggleChecked, isChecked }) => {
  const checkedCount = data.filter((item) => isChecked[item.id]).length;

  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Text style={styles.categorylabel}>{title} </Text>
          <Text style={styles.checkedCount}>
            ({checkedCount}/{data.length})
          </Text>
        </View>
        <Entypo name="chevron-thin-up" size={18} color={COLOR.grey} />
      </View>
      {data.sort().map((item) =>{
        const hasNote = item.note?.trim() !== ""
      return(
        <Pressable
          onPress={() => toggleChecked(item.id)}
          key={item.id}
          style={styles.itemListContainer}
        >
          <View style={styles.itemQuantityContainer}>
            <View style={styles.itemContainer}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked[item.id] || false}
                onValueChange={() => toggleChecked(item.id)}
                color={isChecked[item.id] ? COLOR.primary : undefined}
              />
              <Text
                style={[
                  styles.itemText,
                  isChecked[item.id] && styles.strikethrough,
                ]}
              >
                {item.item}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Text
                style={[
                  styles.quantity,
                  isChecked[item.id] && styles.strikethrough,
                ]}
              >
                {item.quantity}
              </Text>
            </View>
          </View>
          {
            hasNote && (
          <Text style={styles.note}>
            {item.note}
          </Text>
            )
          }
        </Pressable>
      )})}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  categorylabel: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.bodyLarge,
  },
  checkedCount: {
    fontFamily: FONTS.regular,
    letterSpacing: 1,
    fontSize: FONT_SIZE.caption,
  },
  itemQuantityContainer:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    
  },
  itemListContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLOR.stroke,
    padding: 12,
    borderRadius: 8,
  },
  itemContainer: {
    flexDirection: "row",
  },
  checkbox: {
    marginRight: 14,
    borderRadius: 4,
  },
  itemText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.body,
  },
  quantity: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.body,
  },
  note:{
    fontFamily:FONTS.regular,
    fontSize:FONT_SIZE.caption,
    marginTop:12,
    borderTopWidth:1,
    borderColor:COLOR.stroke,
    paddingTop:4,
    fontStyle:"italic"
  },
  strikethrough: {
    textDecorationLine: "line-through",
    color: COLOR.grey,
    opacity: 0.6,
  },
});
export default PackingListCard;
