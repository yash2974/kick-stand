import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import type { Forums } from './Forums'
import type { RootNavigationProp } from '../../App'
import type { HomeNavigationProp } from './Forums'
import { useNavigation } from '@react-navigation/native'
import SafeScreenWrapper from './SafeScreenWrapper'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextInput } from 'react-native-gesture-handler'
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';


const CreateForums = () => {
  const homenavigation = useNavigation<HomeNavigationProp>();
  const rootNavigation = useNavigation<RootNavigationProp>();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");

  const selectTags = (value: string) => {
    setTags(prevTags => {
      if (prevTags.includes(value)) {
        // remove if already selected
        return prevTags.filter(tag => tag !== value);
      } else if (prevTags.length < 2) {
        return [...prevTags, value];
      } else {
        // keep last tag and add new one
        return [prevTags[1], value];
      }
    });
  };
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
  console.log("Opening image library...");
  try {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
    console.log("Image library result:", result);

    if (result.didCancel) {
      console.log("User cancelled image picker");
      return;
    }
    if (result.errorCode) {
      console.log("Image Picker Error:", result.errorCode, result.errorMessage);
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      console.log("Image selected URI:", uri);
      setSelectedImage(uri || null);
    } else {
      console.log("No assets returned");
    }
  } catch (err) {
    console.log("Error launching image library:", err);
  }
};

  const openCamera = async () => {
  console.log("Opening camera...");
  try {
    const result = await launchCamera({ mediaType: 'photo', saveToPhotos: true });
    console.log("Camera result:", result);

    if (result.didCancel) {
      console.log("User cancelled camera");
      return;
    }
    if (result.errorCode) {
      console.log("Camera Error:", result.errorCode, result.errorMessage);
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      console.log("Image captured URI:", uri);
      setSelectedImage(uri || null);
    } else {
      console.log("No assets returned from camera");
    }
  } catch (err) {
    console.log("Error launching camera:", err);
  }
};

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags([]);
    // also clear selected image if you have one
    setSelectedImage(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#121212" }}>
      <SafeScreenWrapper>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 15,
            paddingTop: 15,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => homenavigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={20} color="#C62828" />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: "Inter_18pt-SemiBold",
                fontSize: 20,
                color: "#ECEFF1",
                marginHorizontal: 6,
              }}
            >
              Create Forum
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#C62828",
              alignItems: "center",
              paddingHorizontal: 15,
              paddingVertical: 5,
              borderRadius: 20,
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_18pt-Bold",
                fontSize: 12,
                color: "#ECEFF1",
                marginRight: 4
              }}
            >
              Post
            </Text>
            <MaterialCommunityIcons name="send" size={12} style={{color: "#ECEFF1"}}/>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            multiline
            style={{
              color: "#ECEFF1",
              fontSize: 20,
              marginVertical: 8,
              textAlignVertical: "top",
            }}
          />

          <Text style={{ color: "#ECEFF1", fontSize: 12, marginVertical: 8 }}>
            Add Flairs (optional)
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {["Tips", "Reviews", "Destinations", "Rides", "News"].map((tag) => (
              <TouchableOpacity
                key={tag}
                onPress={() => selectTags(tag)}
                style={{
                  backgroundColor: tags.includes(tag) ? "#C62828" : "#424242",
                  alignItems: "center",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 20,
                  marginRight: 3,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_18pt-Regular",
                    fontSize: 10,
                    color: "#ECEFF1",
                  }}
                >
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Body text"
            value={content}
            onChangeText={setContent}
            multiline
            style={{
              color: "#ECEFF1",
              fontSize: 15,
              marginVertical: 8,
              textAlignVertical: "top",
              flex: 1,
            }}
          />
        </View>

        {/* Footer */}
        <View style={{margin: 8, flexDirection: "row"}}>
          <TouchableOpacity onPress={()=>pickImage()}>
            <MaterialCommunityIcons name="image-plus" size={25} style={{color: "#ECEFF1", margin: 8}}/>
          </TouchableOpacity>  
          <TouchableOpacity onPress={()=>openCamera()}>  
            <MaterialCommunityIcons name="camera-plus" size={25} style={{color: "#ECEFF1", margin: 8}}/>
          </TouchableOpacity>  
          <TouchableOpacity onPress={()=>resetForm()}>  
            <MaterialCommunityIcons name="refresh" size={25} style={{color: "#ECEFF1", margin: 8}}/>
          </TouchableOpacity>  
        </View>
      </SafeScreenWrapper>
    </View>
  );

}

export default CreateForums