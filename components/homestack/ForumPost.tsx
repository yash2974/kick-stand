import { View, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import SafeScreenWrapper from './SafeScreenWrapper';
import type { HomeStackParamList } from './Forums';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { getValidAccessToken } from '../../Auth/checkToken';
import { handleLogout } from '../../Auth/handleLogout';
import { AuthContext } from '../authstack/AuthContext';
import type { RootNavigationProp } from '../../App';
import { HomeNavigationProp } from './Forums';
import Comments from "../Elements/Comments";

type ForumPostRouteProp = RouteProp<HomeStackParamList, 'ForumPost'>;

const ForumPost = () => {
    const rootNavigation = useNavigation<RootNavigationProp>();
    const homenavigation = useNavigation<HomeNavigationProp>();
    const route = useRoute<ForumPostRouteProp>();
    const { item, time, aspectRatio} = route.params;
    const [upvoteCount, setUpvoteCount] = useState(item.upvote);
    const [ upvoted, setUpvoted ] = useState<null | Boolean>(null);
    const [downvoteCount, setDownvoteCount] = useState(item.downvote);
    const [ downvoted, setDownvoted ] = useState<null | Boolean>(null);
    const { userInfo, setUserInfo } = useContext(AuthContext);
    const [ loading, setLoading ] = useState(false)
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [parentCommentUserName, setParentCommentUserName] = useState("");
    const [parentCommentPost_id, setParentCommentPost_id] = useState<string|null>(null);
    const user_id = userInfo?.user.id
    const username = userInfo?.user.name
    
    //fetch liked or not and make a toggle button. change main.py to updatye both upvote in both forums and upcvotesforms
    const getUpvoteStatus = async () => {
        const access_token = await getValidAccessToken();
        if (!access_token) {
            await handleLogout(rootNavigation, setUserInfo);
            return;
        }
        setLoading(true)
        try {
            const response = await fetch (`http://192.168.1.9:8001/upvoted_by/${item._id}/${user_id}`,{
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${accessToken}`,
                }
            });
            if (!response.ok){
                console.log("error");
            }
            const data = await response.json();
            console.log(data);
            setUpvoted(data);
        }
        catch (error){
            console.log("error");
        }
        finally{(setLoading(false))}
    }

    const getDownvoteStatus = async () => {
        const access_token = await getValidAccessToken();
        if (!access_token) {
            await handleLogout(rootNavigation, setUserInfo);
            return;
        }
        setLoading(true)
        try {
            const response = await fetch (`http://192.168.1.9:8001/downvoted_by/${item._id}/${user_id}`,{
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${accessToken}`,
                }
            });
            if (!response.ok){
                console.log("error");
            }
            const data = await response.json();
            console.log(data);
            setDownvoted(data);
        }
        catch (error){
            console.log("error");
        }
        finally{(setLoading(false))}
    }

    const getComments = async () => {
        const access_token = await getValidAccessToken();
        if (!access_token) {
            await handleLogout(rootNavigation, setUserInfo);
            return;
        }
        setLoading(true)
        try {
            const response = await fetch (`http://192.168.1.9:8001/comment/${item._id}`,{
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${accessToken}`,
                }
            });
            if (!response.ok){
                console.log("error");
            }
            const data = await response.json();
            console.log(data);
            setComments(data);
        }
        catch (error){
            console.log("error");
        }
        finally{(setLoading(false))}
    }

    const upvotePost = async ()=> {
        const access_token = await getValidAccessToken();
        if (!access_token) {
            await handleLogout(rootNavigation, setUserInfo);
            return;
        }
        if (loading) return;
        setLoading(true)
        try {
            const response = await fetch (`http://192.168.1.9:8001/upvote/${item._id}/${user_id}`,{
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${accessToken}`,
                }
            });
            if (!response.ok){
                console.log("error");
                return;
            }
            const data = await response.json();
            console.log(data);
            setUpvoted(data);
            setUpvoteCount(prev => (upvoted ? prev - 1 : prev + 1));
        }
        catch (error){
            console.log("error");
        }
        finally{(setLoading(false))}
    }

    const downvotePost = async ()=> {
        const access_token = await getValidAccessToken();
        if (!access_token) {
            await handleLogout(rootNavigation, setUserInfo);
            return;
        }
        if (loading) return;
        setLoading(true)
        try {
            const response = await fetch (`http://192.168.1.9:8001/downvote/${item._id}/${user_id}`,{
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${accessToken}`,
                }
            });
            if (!response.ok){
                console.log("error");
                return;
            }
            const data = await response.json();
            console.log(data);
            setDownvoted(data);
            setDownvoteCount(prev => (downvoted ? prev - 1 : prev + 1));
        }
        catch (error){
            console.log("error");
        }
        finally{(setLoading(false))}
    }

    const postComment = async () => {
        const access_token = await getValidAccessToken();
        if (!access_token) {
            await handleLogout(rootNavigation, setUserInfo);
            return;
        }
        if (loading) return;
        setLoading(true)
        try {
            const response = await fetch (`http://192.168.1.9:8001/comment/${item._id}`,{
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    username: username,
                    post_id: item._id,
                    text: text,
                    parent_comment_id: parentCommentPost_id
                })
            });
            if (!response.ok){
                console.log("error");
                return;
            }
            setParentCommentPost_id(null);
            setParentCommentUserName("");
        }
        catch (error){
            console.log("error");
        }
        finally{
            Keyboard.dismiss();
            getComments();
            setLoading(false);
            setText("");
        }
    }

    useEffect(()=>{
        getUpvoteStatus();
        getDownvoteStatus();
        getComments();
    }, [])

    return (
        <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"} 
    keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} 
  >
        <View style={{flex:1, backgroundColor: "#121212"}}>
            
            <SafeScreenWrapper>
                
                <View style={{flexDirection: "row", paddingHorizontal: 15, paddingTop: 15, alignItems: "center", flexWrap: "wrap"}}>
                    <TouchableOpacity onPress={()=>homenavigation.goBack()}>
                        <MaterialCommunityIcons name="arrow-left" size={20} style={{color: "#C62828"}}/>
                    </TouchableOpacity>
                    <Text style={{ fontFamily: "Inter_18pt-Regular", color: "#C62828", fontSize: 12, marginHorizontal: 8 }}>
                        @{item.username}
                    </Text>
                    {item.tags.map((tag, index) => (
                        <View
                        key={index}
                        style={{
                            backgroundColor: "#ECEFF1",
                            borderRadius: 15,
                            paddingVertical: 1,
                            paddingHorizontal: 5,
                            marginRight: 6,
                            marginBottom: 6,
                        }}
                        >
                        <Text style={{ color: "#121212", fontSize: 8, fontFamily: "Inter_18pt-Bold" }}>#{tag}</Text>
                        </View>
                    ))}
                </View>
                <ScrollView style={{ marginVertical: 2, paddingLeft: 15, paddingRight: 15}} showsVerticalScrollIndicator={false}>
                        <View style={{ marginTop: 4 }}>
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
                                maxHeight: 650, 
                                }}
                                resizeMode="cover"
                            />
                            </View>
                            ) : null}
                            <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 4}}>
                                <View style={{flexDirection: "row", gap: 6}}>
                                    <TouchableOpacity style={{flexDirection: "row", alignItems: "center", gap: 2}} disabled={loading} onPress={()=>{
                                        upvotePost()
                                        }}>
                                        <MaterialCommunityIcons name="arrow-up-bold" size={20} style={{color: upvoted ? "#C62828":"#9E9E9E"}}/>
                                        <Text style={{ fontFamily: "Inter_18pt-Regular", color: upvoted ? "#C62828":"#9E9E9E", fontSize: 12 }}>{upvoteCount}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{flexDirection: "row", alignItems: "center", gap: 2}} disabled={loading} onPress={()=>{
                                        downvotePost()
                                        }}>
                                        <MaterialCommunityIcons name="arrow-down-bold" size={20} style={{color: downvoted ? "#C62828":"#9E9E9E"}}/>
                                        <Text style={{ fontFamily: "Inter_18pt-Regular", color: downvoted ? "#C62828":"#9E9E9E", fontSize: 12 }}>{downvoteCount}</Text>
                                    </TouchableOpacity>
                                    <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                                        <Text style={{ fontFamily: "Inter_18pt-Regular", color: "#9E9E9E", fontSize: 12 }}>Comments {item.comments}</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <Text style={{ fontFamily: "Inter_18pt-Regular", color: "#9E9E9E", fontSize: 10 }}>• {time}</Text>
                                </View>
                            </View>
                            <Text style={{ fontFamily: "Inter_18pt-Regular", color: "#9E9E9E", fontSize: 13 }}>{item.content}</Text>
                            <View style={{ width: "100%", height: 1, backgroundColor: "#1F1F1F", marginVertical: 5}} />
                            <Comments comments={comments} setParentCommentUserName={setParentCommentUserName} setParentCommentPost_id={setParentCommentPost_id}/>
                        </View>
                </ScrollView>
                
                <View
                    style={{
                        height: 40,
                        backgroundColor: "#1F1F1F",
                        marginHorizontal: 15,
                        marginBottom: 5,
                        marginTop: 3,
                        borderRadius: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 10,
                    }}
                    >
                    <TextInput
                        placeholder= {parentCommentUserName ? `Reply to @${parentCommentUserName}` : "Type a comment"}
                        placeholderTextColor="#9E9E9E"
                        textAlignVertical="center"
                        value={text}
                        onChangeText={setText}
                        style={{
                        flex: 1,
                        fontFamily: "Inter_18pt-Regular",
                        fontSize: 14,
                        color: "#eee",
                        }}
                    />
                    {
                        parentCommentUserName ? 
                        <TouchableOpacity onPress={()=>{
                            setParentCommentUserName("")
                            setParentCommentPost_id("")
                        }}>
                        <MaterialCommunityIcons name="close" size={20} style={{ color: "#9E9E9E", marginRight: 8 }} />
                        </TouchableOpacity>
                        : null
                    }
                    <TouchableOpacity onPress={()=>postComment()}>
                        <MaterialCommunityIcons name="send" size={20} style={{ color: "#9E9E9E" }} />
                    </TouchableOpacity>
                </View>
                
            </SafeScreenWrapper>
            
        </View>
        </KeyboardAvoidingView>
    )
}

export default ForumPost