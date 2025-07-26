import { View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import SafeScreenWrapper from './SafeScreenWrapper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { getValidAccessToken } from '../../Auth/checkToken'
import { handleLogout } from '../../Auth/handleLogout'
import type { RootNavigationProp } from '../../App'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../authstack/AuthContext'
import LottieView from 'lottie-react-native'
import { UserProfileNavigationProp } from './UserProfile'

type ServiceReview = {
  _id: string;
  service_centre: string;
  map_url: string;
  review: string;
  rating: number;
  helpful: number;
  created_at: string;
  user_id: string;
  marked: boolean
};

const ServiceReviews = () => {
    const userprofilenavigation = useNavigation<UserProfileNavigationProp>();
    const {setUserInfo} = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = React.useState("");
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [loadingHelpful, setLoadingHelpful] = useState(false);
    // const [helpful, setHelpful] = useState<boolean | null>(null);
    const [reviews, setReviews] = useState<ServiceReview[]>([]);
    const rootNavigation = useNavigation<RootNavigationProp>();
    const [selectedReview, setSelectedReview] = useState<string|null>(null);
    const [lastReview, setLastReview] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
      setRefreshing(true);
      setReviews([]); 
      setLastReview("");
      setHasMore(true);
      await getReviews(debouncedSearch);
      setRefreshing(false);
    };

    const getReviews = async (debouncedSearch: string) => {
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
            let url = `https://kick-stand.onrender.com/service-review?limit=10&query=${debouncedSearch}`
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
            setReviews(prevData => [...prevData, ...data.data])
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

    const makeHelpful = async (id: string) => {
        setLoadingHelpful(true);
        const access_token = await getValidAccessToken();
        if (!access_token) {
            setLoadingHelpful(false);
            handleLogout(rootNavigation, setUserInfo)
            return;
        }
        try {
            const response = await fetch (`https://kick-stand.onrender.com/service-review-helpful/${id}`,{
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
            if (!response.ok){
                console.log("error");
                setLoadingHelpful(false);
                return;
            }
            const data = await response.json();
            setReviews(prevReviews =>
            prevReviews.map(r =>
                r._id === id 
                    ? { 
                        ...r, 
                        marked: data, 
                        helpful: data ? 
                            r.helpful + 1   
                            : 
                            r.helpful - 1   
                      } 
                    : r
            )
            );
        }
        catch (error){
            console.log("error");
        }
        finally{(setLoadingHelpful(false))}
    }

    

    const renderReviews = ({item}: {item: ServiceReview}) => (
        <View style={{backgroundColor: "#1F1F1F", marginVertical: 4, borderRadius: 10, padding: 10 }}>
            <Text style={{
                  fontFamily: "Inter_18pt-Regular",
                  color: "#C62828",
                  fontSize: 15,
                }}>{item.service_centre}</Text>
            <Text style={{
                  fontFamily: "Inter_18pt-Regular",
                  color: "#9E9E9E",
                  fontSize: 12,}}>{item.review}</Text>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    {Array.from({ length: item.rating }).map((_, index) => (
                            <MaterialCommunityIcons key={index} name="star" size={20} color="#EF6C00" />
                    ))}
                </View>
                <View style={{flexDirection: "row", alignItems: "baseline"}}>
                    <Text style={{
                    fontFamily: "Inter_18pt-Regular",
                    color: "#424242",
                    fontSize: 10,
                    marginRight: 6}}>{item.helpful} found helpful</Text>
                    <TouchableOpacity onPress={()=>makeHelpful(item._id)} disabled={loadingHelpful}>
                        <MaterialCommunityIcons name="thumb-up" size={15} color= {item.marked ? "#EF6C00" : "#424242" }/>
                    </TouchableOpacity>
                </View>
            </View>
            
        </View>
    )

    useEffect(()=>{
        const delayDebounce = setTimeout(()=>{
            setDebouncedSearch(search);
        }, 500)
        return ()=> clearTimeout(delayDebounce)
    }, [search])
    useEffect(()=>{
        getReviews(debouncedSearch);
    }, [])

    return (
        <View style={{flex: 1, backgroundColor : "#121212"}}> 
            <SafeScreenWrapper>
                <View style={{flex: 1, padding: 15}}>
                    <View style={{flex: 3}}>
                        <Text style={{ fontSize: 24, fontFamily: "Bitcount-VariableFont_CRSV,ELSH,ELXP,slnt,wght", color: "#C62828"}}>
                            Service Reviews
                        </Text>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderRadius: 10, paddingHorizontal: 5, borderColor: "#C62828", marginVertical: 8}}>
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
                            renderItem={renderReviews}
                            keyExtractor={item => item._id}
                            onEndReached={()=>getReviews(debouncedSearch)}
                            onEndReachedThreshold={0.5}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={ loadingReviews ?
                                (
                                    <View style={{justifyContent: "center", alignItems: "center", marginVertical: 100}}>
                                    <LottieView source={require('../../assets/loading/loadingAnimation.json')} autoPlay loop style={{ width: 100, height: 100 }} />
                                    <Text style={{ color: '#9c908f', fontFamily: "Inter_18pt-Bold", fontSize: 10}}>Bringing in experiences…</Text>
                                    </View>
                                ) : (
                                    
                                    <View style={{justifyContent: "center", alignItems: "center", marginVertical: 10}}>
                                    <View style={{width: "100%", height: 1, backgroundColor: "#1F1F1F", marginBottom: 10}}/>
                                    {/* <MaterialCommunityIcons name="engine-off" size={40} color="#9c908f"/> */}
                                    <Text style={{ color: '#9c908f', fontFamily: "Inter_18pt-Bold", fontSize: 10}}>You’ve reached the end. Contribute your experience!</Text>
                                    </View>
                                )
                            }
                            refreshControl={
                                <RefreshControl refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={["#C62828"]}
                                progressBackgroundColor="#121212"
                                progressViewOffset={50} />
                            }
                        />
                    </View>
                    <TouchableOpacity onPress={()=>userprofilenavigation.navigate("CreateReviews")}
                        style={{
                            backgroundColor: "#C62828",
                            marginTop: 12,
                            borderRadius: 10,
                            paddingVertical: 14,
                            alignItems: "center",
                        }}>
                        <Text style={{ fontSize: 20, fontFamily: "Inter_18pt-Bold", color: "#121212" }}>
                            Add Review
                        </Text>
                        <Text style={{ color: "#121212", fontSize: 12, fontFamily: "Inter_18pt-SemiBold" }}>
                            Write a Review for a Service Center
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeScreenWrapper>
        </View>
    )
}

export default ServiceReviews