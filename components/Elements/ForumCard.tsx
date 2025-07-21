import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Pressable, TouchableHighlight } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigation } from "@react-navigation/native";
import type { HomeStackParamList, Forums } from "../homestack/Forums";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
dayjs.extend(utc);
dayjs.extend(relativeTime);

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, "ForumPost">;

export const ForumCard = ({ item }: { item: Forums }) => {
  const [aspectRatio, setAspectRatio] = useState(1);
  const navigation = useNavigation<NavigationProp>();
 
  useEffect(() => {
    if (item.image_url) {
      Image.getSize(
        item.image_url,
        (width, height) => {
          setAspectRatio(width / height);
        },
        (error) => {
          console.log("Image size fetch failed", error);
        }
      );
    }
  }, [item.image_url]);

  const time = dayjs(item.created_at).fromNow();

  return (
    <TouchableHighlight onPress={()=>{navigation.navigate("ForumPost", {item, time, aspectRatio})}}>
        <View style={{ marginVertical: 2 }}>
        <View style={{ width: "100%", height: 1, backgroundColor: "#1F1F1F" }} />
        <View style={{ marginVertical: 4 }}>
            <Text style={{ fontFamily: "Inter_18pt-Regular", color: "#C62828", fontSize: 12 }}>
            @{item.username}
            </Text>
            <Text style={{ fontFamily: "Inter_18pt-SemiBold", color: "#ECEFF1", fontSize: 16 }}>
            {item.title}
            </Text>
            {item.image_url ? (
            <View style={{width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "#9E9E9E", marginVertical: 4, borderRadius: 8, overflow: "hidden"}}>
            <Image
                source={{ uri: item.image_url }}
                style={{
                width: "100%",
                aspectRatio,
                maxHeight: 300, 
                }}
                resizeMode="cover"
            />
            </View>
            ) : null}
            <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 4}}>
                <View style={{flexDirection: "row", gap: 6}}>
                    <View style={{flexDirection: "row", alignItems: "center", gap: 2}}>
                        <MaterialCommunityIcons name="arrow-up-bold" size={20} style={{color: "#9E9E9E"}}/>
                        <Text style={{ fontFamily: "Inter_18pt-Regular", color: "#9E9E9E", fontSize: 12 }}>{item.upvote}</Text>
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center", gap: 2}}>
                        <MaterialCommunityIcons name="arrow-down-bold" size={20} style={{color: "#9E9E9E"}}/>
                        <Text style={{ fontFamily: "Inter_18pt-Regular", color: "#9E9E9E", fontSize: 12 }}>{item.downvote}</Text>
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                        <Text style={{ fontFamily: "Inter_18pt-Regular", color: "#9E9E9E", fontSize: 12 }}>Comments {item.comments}</Text>
                    </View>
                </View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Text style={{ fontFamily: "Inter_18pt-Regular", color: "#9E9E9E", fontSize: 10 }}>• {time}</Text>
                </View>
            </View>
            <Text style={{ fontFamily: "Inter_18pt-Regular", color: "#9E9E9E", fontSize: 13 }}>{item.content}</Text>
        </View>
        </View>
    </TouchableHighlight>
  );
};
