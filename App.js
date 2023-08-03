import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import MediaScreen from "./components/MediaScreen";
import CameraScreen from "./components/CameraScreen";
import HomeScreen from "./components/HomeScreen";
import { View } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: "grey" }}>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </View>
  );
}

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Media" component={MediaScreen} />
    </Stack.Navigator>
  );
}
