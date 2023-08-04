import { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import * as MediaLibrary from "expo-media-library";

const windowWidth = Dimensions.get("window").width;

const imageWidth = windowWidth * 0.33;
const iamgeGap = windowWidth * 0.005;

export default function MediaScreen() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  async function loadInitialPhotos() {
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.photo,
      sortBy: ["creationTime"],
      first: 21,
    });

    setPhotos(media.assets);
  }

  async function loadMorePhotos() {
    let media = await MediaLibrary.getAssetsAsync({
      after: photos[photos.length - 1].id,
      mediaType: MediaLibrary.MediaType.photo,
      sortBy: ["creationTime"],
      first: 21,
    });

    setPhotos([...photos, ...media.assets]);
  }

  useEffect(() => {
    if (permissionResponse && permissionResponse.granted) {
      loadInitialPhotos();
    }
  }, [permissionResponse]);

  if (!permissionResponse) {
    return <View />;
  }

  const { granted, canAskAgain } = permissionResponse;

  if (!granted && canAskAgain) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={requestPermission}
          style={{ backgroundColor: "black", padding: 20, borderRadius: 10 }}
        >
          <Text style={{ color: white }}>requestPermission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!granted && !canAskAgain) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ textAlign: "center", fontSize: 16 }}>
          You did not give permission to see photos
        </Text>
      </View>
    );
  }

  async function HandleUpload() {
    const photo = selectedPhotos[0];

    const info = await MediaLibrary.getAssetInfoAsync(photo);

    console.log({ info });

    const data = new FormData();
    data.append("file", { uri: info.localUri, name: info.filename });
    data.append("upload_preset", "gqbxephi");
    data.append("cloud_name", "dh9qpg5a9");

    fetch("https://api.cloudinary.com/v1_1/dh9qpg5a9/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data.secure_url);
      })
      .catch((err) => {
        console.log("Error");
      });
  }

  return (
    <View style={{ position: "relative", flex: 1 }}>
      <FlatList
        onEndReached={loadMorePhotos}
        numColumns={3}
        data={photos}
        renderItem={({ item, index }) => (
          <ImageItem
            onSelect={() => setSelectedPhotos([...selectedPhotos, item])}
            onRemove={() =>
              setSelectedPhotos(
                selectedPhotos.filter((selected) => selected.id !== item.id)
              )
            }
            selected={
              selectedPhotos.findIndex((selected) => selected.id === item.id) +
              1
            }
            photo={item}
            index={index}
          />
        )}
        keyExtractor={(item) => item.uri}
      />

      {selectedPhotos.length > 0 && (
        <TouchableOpacity
          onPress={HandleUpload}
          style={{
            position: "absolute",
            width: 380,
            height: 50,
            backgroundColor: "black",
            bottom: 20,
            left: 20,
            right: 20,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", padding: 20 }}>upload</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function ImageItem({ photo, index, onSelect, onRemove, selected }) {
  const marginHorizontal = index % 3 === 1 ? iamgeGap : 0;

  return (
    <TouchableOpacity onPress={() => (selected ? onRemove() : onSelect())}>
      <View
        style={{
          width: imageWidth,
          height: imageWidth,
          marginBottom: iamgeGap,
          marginHorizontal,
          position: "relative",
        }}
      >
        <Image
          source={{ uri: photo.uri }}
          style={{
            backgroundColor: "#ccc",
            width: imageWidth,
            height: imageWidth,
          }}
        />
        {!!selected && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.6)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "blue",
                width: 30,
                height: 30,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white" }}>{selected}</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
