import { View, Text, Linking, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import SafeScreenWrapper from '../homestack/SafeScreenWrapper'
import LottieView from 'lottie-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';


const Support = () => {

  const upiId = "9310597897@pthdfc"; // replace with your UPI ID
  const name = "Yash Bisht";
  const amount = ""; // optional, can leave empty
  const navigation = useNavigation();

  const handleUpiPayment = () => {
    const url = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;
    Linking.openURL(url).catch(() => {
      alert("No UPI app found. Please install a UPI app to make payments.");
    });
  };
  const handleGithub= () => {
    const url = `https://github.com/yash2974/kick-stand`;
    Linking.openURL(url);
  }
  return (
    <View style={{flex:1, backgroundColor: "#121212"}}>
      <SafeScreenWrapper>
        <View style={{flex: 1, justifyContent: "space-between"}}>
          <View style={{ padding: 15}}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <TouchableOpacity onPress={()=>navigation.goBack()}>
                <MaterialCommunityIcons name="arrow-left" size={20} color="#C62828" style={{marginRight: 10 }}/>
              </TouchableOpacity>
              <Text style={{color: "#C62828", fontFamily: "Inter_18pt-Bold", fontSize: 20}}>Support The Developer</Text>
            </View>
            <Text  style={{color: "#EF6C00", fontFamily: "Inter_18pt-SemiBoldItalic", fontSize: 10, marginTop: 10}}>This project is an independently funded initiative that operates within the constraints of limited resources, which may at times affect overall performance and restrict functionalities such as image uploads. Despite these limitations, our goal remains to provide a reliable and evolving platform for the community. Your support plays a vital role in ensuring the sustainability and growth of this project. Contributions can take various forms—whether through donations via UPI, active collaboration on the codebase if you are a developer, or simply by engaging with sponsored content and advertisements that help offset operational costs. Every form of support, no matter how small, directly contributes to maintaining the platform, improving its capabilities, and ensuring that it remains accessible to all who benefit from it. Together, we can continue building and strengthening this community, fostering innovation and collaboration even in the face of resource limitations.</Text>
          </View>
          <View style={{marginVertical: 30}}>
            <TouchableOpacity onPress={handleUpiPayment} style={{ alignSelf:"center"}}>
              <Image source={require("../../assets/loading/bmc-button.png")} style={{width: 250, height: undefined, aspectRatio: 4, borderRadius: 20}}/>
            </TouchableOpacity>
            <TouchableOpacity  style={{ alignSelf:"center"}}>
              <View style={{backgroundColor: "#C62828", paddingHorizontal: 30, borderRadius: 20, paddingVertical: 12, marginTop: 10, flexDirection: "row", alignItems: "center"}}>
                <MaterialCommunityIcons name="play-box-outline" size={35} color="#000" style={{marginRight: 6}} />
                <Text style={{color: "#121212", fontFamily: "Cookie-Regular", fontSize: 35}}>Watch an add</Text>
              </View>
            </TouchableOpacity>
            <View style={{justifyContent: "center", width: "100%", alignItems: "center", marginVertical: 20}}>
              <Text style={{color: "#EF6C00", fontFamily: "Inter_18pt-Bold", fontSize: 15}}>Alternatively, if you are a fellow developer</Text>
            </View>
            <TouchableOpacity  style={{ alignSelf:"center"}} onPress={handleGithub}>
              <View style={{backgroundColor: "#6f42c1", paddingHorizontal: 68, borderRadius: 20, paddingVertical: 12, flexDirection: "row", alignItems: "center"}}>
                <MaterialCommunityIcons name="github" size={30} color="#FFFFFF" style={{marginRight: 10 }}/>
                <Text style={{color: "#FFFFFF", fontFamily: "Cookie-Regular", fontSize: 35}}>Github</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* <LottieView source={require('../../assets/loading/SupportLoading.json')} autoPlay loop style={{ height: 100 }} /> */}
      </SafeScreenWrapper>
    </View>
  )
}


export default Support