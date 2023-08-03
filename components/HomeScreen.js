import { Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  return (
    <View
      style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly" }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
        <AntDesign name="camera" size={104} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Media")}>
        <FontAwesome name="photo" size={104} color="black" />
      </TouchableOpacity>
    </View>
  );
}
