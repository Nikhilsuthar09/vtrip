import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import Checkbox from "expo-checkbox";
import { useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const PackingListCard = ({
  title,
  data,
  toggleChecked,
  isChecked,
  openModal,
  isLast,
  handleAddByCategory
}) => {
  const pressableRefs = useRef({});
  const checkedCount = data.filter((item) => item.isPacked).length;

  const handleMenuPress = (itemId) => {
    return (e) => {
      const pressableRef = pressableRefs.current[itemId];
      if (pressableRef) {
        pressableRef.measure((x, y, width, height, pageX, pageY) => {
          openModal({
            x: pageX,
            y: pageY + height,
            width,
            height,
            itemId: itemId,
          });
        });
      }
    };
  };
  return (
    <View style={[styles.container, isLast && { marginBottom: 50 }]}>
      <View style={styles.categoryContainer}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Text style={styles.categorylabel}>{title} </Text>
          <Text style={styles.checkedCount}>
            ({checkedCount}/{data.length})
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleAddByCategory(title)}>
        <Ionicons name="add" color={COLOR.primary} size={22}  />
        </TouchableOpacity>
      </View>
      {data.sort().map((item) => {
        const hasNote = item.note?.trim() !== "";
        return (
          <Pressable
            ref={(ref) => {
              pressableRefs.current[item.id] = ref;
            }}
            onPress={() => !item.isPacked && toggleChecked(item.id)}
            onLongPress={handleMenuPress(item.id)}
            key={item.id}
            style={styles.itemListContainer}
          >
            <View style={styles.itemQuantityContainer}>
              <View style={styles.itemContainer}>
                <Checkbox
                  disabled={item.isPacked}
                  style={styles.checkbox}
                  onValueChange={() => toggleChecked(item.id)}
                  value={isChecked[item.id] || false}
                  color={isChecked[item.id] ? COLOR.primary : undefined}
                />
                <Text
                  style={[
                    styles.itemText,
                    item.isPacked && styles.strikethrough,
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
                    item.isPacked && styles.strikethrough,
                  ]}
                >
                  {item.quantity}
                </Text>
                <TouchableOpacity onPress={handleMenuPress(item.id)}>
                  <Entypo name="dots-three-vertical" size={16} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            {hasNote && <Text style={styles.note}>{item.note}</Text>}
          </Pressable>
        );
      })}
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
  itemQuantityContainer: {
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
  note: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.caption,
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: COLOR.stroke,
    paddingTop: 4,
    fontStyle: "italic",
  },
  strikethrough: {
    textDecorationLine: "line-through",
    color: COLOR.grey,
    opacity: 0.6,
  },
});
export default PackingListCard;
