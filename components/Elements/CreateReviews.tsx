import { View, Text, TouchableOpacity, ActivityIndicator, Image, Linking } from 'react-native'
import React, { useContext, useState } from 'react'
import type { Forums } from '../homestack/Forums'
import type { RootNavigationProp } from '../../App'
import { useNavigation } from '@react-navigation/native'
import SafeScreenWrapper from '../homestack/SafeScreenWrapper'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextInput } from 'react-native-gesture-handler'
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import { AuthContext } from '../authstack/AuthContext'
import type { UserProfileNavigationProp } from '../homestack/UserProfile'
import { getValidAccessToken } from '../../Auth/checkToken'
import { handleLogout } from '../../Auth/handleLogout';


const CreateReviews = () => {
  const userprofilenavigation = useNavigation<UserProfileNavigationProp>();
  const rootNavigation = useNavigation<RootNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const {userInfo, setUserInfo} = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [map_url, setMap_url] = useState("");
  const user_id = userInfo?.user.id;

  const submitForum = async () => {
    setLoading(true);
    const access_token = await getValidAccessToken();
    if (!access_token){
      setLoading(false);
      handleLogout(rootNavigation, setUserInfo);
      return;
    }
    if (!name || !review){
      alert("dont leave title/body empty!!!")
      setLoading(false);
      return;
    }
    try {
      console.log("Submitting forum post...");
      const response = await fetch ("https://kick-stand.onrender.com/service-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          service_centre: name,
          map_url: map_url,
          review: review,
          rating: rating,
          user_id: user_id
        })
      })
      if(!response.ok){
        console.log("error");
        alert("There was an error.")
        setLoading(false);
        return;
      }
      const data = await response.json();
      console.log("Ride created successfully:", data);
      resetForm();
      alert("Review submitted for approval!!")
      userprofilenavigation.reset({
        index: 1, 
        routes: [
          { name: 'UserProfileContent' },
          { name: 'ServiceReviews' },
        ],
      });
    } catch (err) {
      console.error("submitForm error:", err);
    }
    finally {
      setLoading(false);
    }
  };

  const openGoogleMaps= ()=> {
      const url = "https://www.google.com/maps"
      Linking.openURL(url);
    }
  

  const resetForm = () => {
    setName("");
    setReview("");
    setRating(0);
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
            <TouchableOpacity onPress={() => userprofilenavigation.goBack()}>
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
              Add Review
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: loading ? "#9E9E9E":"#C62828",
              alignItems: "center",
              paddingHorizontal: 15,
              paddingVertical: 5,
              borderRadius: 20,
              flexDirection: "row",
              justifyContent: "center"
            }}
            onPress={()=>submitForum()}
            disabled = {loading}
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
            { loading ? <ActivityIndicator size="small" color="#ECEFF1"/> : <MaterialCommunityIcons name="send" size={12} style={{color: "#ECEFF1"}}/>}         
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <TextInput
            placeholder="Service Center Name"
            placeholderTextColor="#9E9E9E"
            value={name}
            onChangeText={setName}
            multiline
            numberOfLines={3} 
            maxLength={200}
            style={{
              color: "#ECEFF1",
              fontSize: 20,
              marginVertical: 8,
              textAlignVertical: "top",
              fontFamily: "Inter_18pt-Regular"
            }}
          />
          <View style={{flexDirection: "row", alignItems: "center"}}>
                              <TouchableOpacity style={{marginVertical: 10}} onPress={openGoogleMaps}>
                                  <Image source={require('../../assets/photos/logo.png')} style={{ width: 30, height: 30 }}/>
                              </TouchableOpacity>
                              <TextInput
                              placeholder='Google Maps Link'
                              placeholderTextColor="#66BB6A"
                              value={map_url}
                              onChangeText={setMap_url}
                              maxLength={100}
                              numberOfLines={1}
                              style={{
                                  marginHorizontal: 6,
                                  color: "#66BB6A",
                                  fontSize: 12,
                                  marginVertical: 8,
                                  textAlignVertical: "top",
                                  flex: 1,
                                  fontFamily: "Inter_18pt-Regular"
                              }}
                              />
                              <TouchableOpacity>
                                  <MaterialCommunityIcons name="help-circle" size={20} style={{color: "#66BB6A", margin: 8}}/>
                              </TouchableOpacity>
                          </View>

          <Text style={{ color: "#ECEFF1", fontSize: 12, marginVertical: 8, fontFamily: "Inter_18pt-Regular" }}>
            Add Rating
          </Text>
          <View style={{flexDirection: "row"}}>
            {Array.from({ length: 5 }).map((_, index) => (
              <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
                <MaterialCommunityIcons
                  name={index < rating ? "star" : "star-outline"}
                  size={25}
                  color="#EF6C00"
                />
              </TouchableOpacity>
            ))}
          </View>



          <TextInput
            placeholder="Review"
            placeholderTextColor="#9E9E9E"
            value={review}
            onChangeText={setReview}
            multiline
            style={{
              color: "#ECEFF1",
              fontSize: 15,
              marginVertical: 8,
              textAlignVertical: "top",
              flex: 1,
              fontFamily: "Inter_18pt-Regular"
            }}
          />
        </View>

        {/* Footer */}
        <View style={{margin: 8, flexDirection: "row", alignItems: "center"}}>
         
          <TouchableOpacity onPress={()=>resetForm()}>  
            <MaterialCommunityIcons name="refresh" size={25} style={{color: "#ECEFF1", margin: 8}}/>
          </TouchableOpacity>  
    
        </View>
      </SafeScreenWrapper>
    </View>
  );

}

export default CreateReviews