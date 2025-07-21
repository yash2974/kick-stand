import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
type Comment = {
  _id: string;
  post_id: string;
  username: string;
  text: string;
  created_at: string;
  parent_comment_id: string | null;
};

type CommentsProps = {
  comments: Comment[];
  setParentCommentUserName: (username: string) => void;
  setParentCommentPost_id: (postId: string) => void;
};

export default function Comments({ comments, setParentCommentUserName, setParentCommentPost_id, }: CommentsProps) {
    console.log(comments)
    const topLevel = comments.filter(c => c.parent_comment_id === null);
    const replies = comments.filter(c => c.parent_comment_id !== null);
    

    const getReplies = (parentId: string) =>
        replies.filter(r => r.parent_comment_id === parentId);

    const renderComment = (comment: Comment, depth = 0) => {
        const time = dayjs(comment.created_at + "Z").fromNow();
        return(
            <View key={comment._id} style={{ marginVertical: 4 }}>
            <View
                style={{
                position: "absolute",
                width: 1,
                top: 0,
                bottom: 0,
                left: depth * 12,
                backgroundColor: "#555",
                }}
            />
            <View
                style={{
                padding: 0,
                borderRadius: 4,
                marginLeft: depth * 12 + 8,
                }}
            > 
                <Text style={{ color: "#9E9E9E", fontFamily: "Inter_18pt-Regular", fontSize: 10 }}>
                @{comment.username}
                </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text
                        style={{ color: "#eee", fontFamily: "Inter_18pt-Regular", fontSize: 12, flex: 1 }}
                        numberOfLines={0}
                    >
                        {comment.text}
                    </Text>
                    <Text style={{ color: "#9E9E9E", fontFamily: "Inter_18pt-Regular", fontSize: 8, marginLeft: 10 }}>
                         • {time}
                    </Text>

                </View>
                {comment.parent_comment_id ? null :
                <TouchableOpacity onPress={()=>{
                    setParentCommentUserName(comment.username);
                    setParentCommentPost_id(comment._id)
                }}>
                <Text
                    style={{
                        color: "#C62828",
                        fontFamily: "Inter_18pt-Regular",
                        fontSize: 10,
                        marginTop: 2,
                    }}
                >
                    Reply to @{comment.username}
                </Text>
                </TouchableOpacity>}

            </View>
            {getReplies(comment._id).map(reply => renderComment(reply, depth + 1))}
            </View>
            );
    };

    return (<View>{topLevel.map(c => renderComment(c))}</View>);
}
