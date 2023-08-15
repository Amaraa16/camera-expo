import { Camera, CameraType } from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View, Animated } from "react-native";
import * as MediaLibrary from "expo-media-library";

export default function CameraScreen() {
  const [type, setType] = useState(CameraType.back);
  const [blackBgr, setBlackBgr] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [ratioExpanded, setRatioExpanded] = useState(false);

  const ratioWidth = useRef(new Animated.Value(100)).current;

  function expand() {
    setRatioExpanded(true);
    Animated.timing(ratioWidth, {
      toValue: 200,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }

  function shrink() {
    setRatioExpanded(false);
    Animated.timing(ratioWidth, {
      toValue: 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }

  const cameraRef = useRef();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  async function takePicture() {
    setBlackBgr(true);
    setTimeout(() => {
      setBlackBgr(false);
    }, 300);
    const result = await cameraRef.current.takePictureAsync();
    MediaLibrary.saveToLibraryAsync(result.uri);
  }

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={{ flex: 1 }} type={type}>
        <View
          style={{
            position: "absolute",
            backgroundColor: "black",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            opacity: blackBgr ? 1 : 0,
          }}
        ></View>
        <TouchableOpacity activeOpacity={0.8} onPress={() => (ratioExpanded ? shrink() : expand())}>
          <Animated.View style={{ borderRadius: 20, backgroundColor: "rgba(255,255,255,0.4)", width: ratioWidth, padding: 20, margin: 20, alignItems: "center" }}>
            <Text style={{ color: "white" }}>4 : 3</Text>
          </Animated.View>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>take pic</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
