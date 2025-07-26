import { View, Text, TextInput, FlatList, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import SafeScreenWrapper from './SafeScreenWrapper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { getValidAccessToken } from '../../Auth/checkToken'
import { handleLogout } from '../../Auth/handleLogout'
import type { RootNavigationProp } from '../../App'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../authstack/AuthContext'

type ServiceReview = {
  _id: string;
  service_centre: string;
  map_url: string;
  review: string;
  rating: number;
  helpful: number;
  created_at: string;
  user_id: string;
};

const ServiceReviews = () => {

    const {setUserInfo} = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviews, setReviews] = useState<ServiceReview[]>([]);
    const rootNavigation = useNavigation<RootNavigationProp>();
    const [lastReview, setLastReview] = useState("");
    const [hasMore, setHasMore] = useState(true);

    const getReviews = async () => {
        if(loadingReviews || !hasMore){
            return;
        }
        setLoadingReviews(true);
        const access_token = await getValidAccessToken();
        if (!access_token) {
            setLoadingReviews(false);
            handleLogout(rootNavigation, setUserInfo)
            return;
        }
        try {
            let url = "https://kick-stand.onrender.com/service-review?limit=20"
            if (lastReview) url += `&after=${lastReview}`;
            const response = await fetch (url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });
            if (!response.ok){
                console.log("error");
                setLoadingReviews(false);
                return;
            }
            const data = await response.json();
            console.log(data)
            if (data && Array.isArray(data.data)) {
            setReviews(data.data)
            setLastReview(data.nextCursor);
            setHasMore(!!data.nextCursor);
        }
    }
        catch(error){
            console.log("error fetching ");
        }
        finally{
            setLoadingReviews(false);
        }
    }

    useEffect(()=>{
        getReviews();
    }, [])

    return (
        <View style={{flex: 1, backgroundColor : "#121212"}}> 
            <SafeScreenWrapper>
                <View style={{flex: 1, padding: 15}}>
                    <Text style={{ fontSize: 24, fontFamily: "Bitcount-VariableFont_CRSV,ELSH,ELXP,slnt,wght", color: "#C62828"}}>
                        Service Reviews
                    </Text>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderRadius: 10, paddingHorizontal: 5, borderColor: "#C62828", marginVertical: 4}}>
                        <TextInput
                            placeholder='Search Centres'
                            placeholderTextColor="#9E9E9E"
                            style={{ fontSize: 15, fontFamily: "Inter_18pt-SemiBold", color: "#9E9E9E", flex: 1}}
                            value={search}
                            onChangeText={setSearch}
                        />
                        <MaterialCommunityIcons name="table-search" size={24} color="#9E9E9E"/>
                    </View>
                     <FlatList
      data={reviews}
      renderItem={({ item }) => <Text>{item.review}</Text>}
      keyExtractor={item => item._id}
      onEndReached={getReviews}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingReviews ? <ActivityIndicator color="#C62828" /> : null
      }
    />
                </View>
            </SafeScreenWrapper>
        </View>
    )
}

export default ServiceReviews