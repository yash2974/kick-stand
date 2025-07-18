import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import type { Forums } from './Forums'
import type { RootNavigationProp } from '../../App'
import type { HomeNavigationProp } from './Forums'
import { useNavigation } from '@react-navigation/native'
import SafeScreenWrapper from './SafeScreenWrapper'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const CreateForums = () => {
  const homenavigation = useNavigation<HomeNavigationProp>();
  const rootNavigation = useNavigation<RootNavigationProp>();
  return (
    <View style={{flex: 1, backgroundColor: "#121212"}}>
      <SafeScreenWrapper>
        <View>
          <View style={{flexDirection: "row", paddingHorizontal: 15, paddingTop: 15, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap"}}>
              <View style={{flexDirection: "row", alignItems: "center"}}>
              <TouchableOpacity onPress={()=>homenavigation.goBack()}>
                  <MaterialCommunityIcons name="arrow-left" size={20} style={{color: "#C62828"}}/>
              </TouchableOpacity>
              <Text style={{fontFamily: "Inter_18pt-SemiBold", fontSize: 20, color: "#ECEFF1", marginHorizontal: 6}}>
                Create Forum
              </Text>
            </View>
            <TouchableOpacity style={{ backgroundColor: "#C62828", alignItems: "center", paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20}}>
              <Text style={{fontFamily: "Inter_18pt-Bold", fontSize: 12, color: "#ECEFF1"}}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex: 1, paddingLeft: 15, paddingRight: 15}}>

        </View>
      </SafeScreenWrapper>
    </View>
  )
}

export default CreateForums