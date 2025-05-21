import React, { use, useEffect } from "react";
import { View,Image, FlatList, TextInput, Button, Modal, ActivityIndicator} from "react-native";
import { Text } from "react-native-gesture-handler";
import { AuthContext } from "../authstack/AuthContext";
import { useContext } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import PieChart from "react-native-pie-chart";

type UserDetails = {
    name: string;
    phone: string;
    email: string;
};

export default function Garage() {
    const { userInfo } = useContext(AuthContext);
    const [userDetails, setUserDetails] = React.useState<UserDetails | null>(null);
    const [monthly_expenditure, setMonthlyExpenditure] = React.useState<number>(0);
    const [expenditure, setExpenditure] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true)
    
    const user_id = userInfo?.user.id;
    const profile_picture = userInfo?.user.photo;
    const user_name = userInfo?.user.name;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // add leading zero
    const monthName = new Date().toLocaleString('default', { month: 'long' });
    console.log(monthName); // 👉 "May"
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    console.log("Current date:", formattedDate); 
    console.log(month)

    const get_user_details = async () => {
        const response = await fetch(`http://192.168.1.8:8001/users/${user_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        setUserDetails(data);
        console.log("User details", data);
    }

    const get_user_expenditure_monthly = async () => {
        const params = {
            start_date: `${year}-${month}-01`,
            end_date: `${year}-${month}-31`,
        }
        const response = await fetch(`http://192.168.1.8:8001/expenses/${user_id}?${params}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        const totalExpenditure = data.reduce((acc: number, expense: { amount: number }) => acc + expense.amount, 0);
        setMonthlyExpenditure(totalExpenditure);
        console.log("Monthly expenditure", totalExpenditure);
    }

    const get_user_expenditure = async () => {
        const response = await fetch(`http://192.168.1.8:8001/expenses/${user_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        setExpenditure(data);
        console.log("Expenditure", data);
        const categoryTotals: { [key: string]: number } = {};
        data.forEach((item: { category: any; amount: any; }) => {
            const { category, amount } = item;
            categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        });
        console.log("Category totals", categoryTotals);
        if (expenditure){
            setIsLoading(false)
        }
    }

    const categoryIconMap: { [key: string]: { name: string; color: string } } = {
        Fuel: { name: 'fuel', color: '#FF6B6B'  },
        Service: { name: 'tools',        Documents: { name: 'file-document-multiple', color: '#4CAF50' },
        Accessories: { name: 'view-grid-plus', color: '#FFD700' },
        Tyres : { name:"circle-double", color:"#4FC3F7" },
        Other: { name: 'beaker-question', color: '#9575CD' },
    };

    const presentCategories = Array.from(new Set(expenditure.map((e) => e.category)));
    
    // Updated icon size calculation based on number of categories
    const getIconSize = (categoryCount: number) => {
        if (categoryCount <= 2) return 30;
        if (categoryCount <= 4) return 25;
        return 20;
    };
    
    const iconSize = getIconSize(presentCategories.length);

    
    // Replace the static series array with dynamic data calculated from expenses
const generatePieChartData = () => {
  const categoryTotals: { [key: string]: number } = {};
  
  // Sum up amounts by category
  expenditure.forEach((item) => {
    const { category, amount } = item;
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  });
  
  // Transform into the series format needed for PieChart
  const colors = {
    'Fuel': '#FF6B6B',
    'Service': '#FFA726',
    'Tyres': '#4FC3F7',
    'Documents': '#4CAF50',
    'Accessories': '#FFD700',
    'Other': '#9575CD'
  };
  
  return Object.entries(categoryTotals).map(([category, amount]) => ({
    value: amount,
    color: colors[category as keyof typeof colors] || '#9E9E9E'
  }));
};

const widthAndHeight = 130;
const series = generatePieChartData();
    
    useEffect(() => {
        get_user_details();
        get_user_expenditure_monthly();
        get_user_expenditure();
    }, []);



    return (
        <View style={{ flex: 1, flexDirection:"column", backgroundColor: "#121212", padding: 25 }}>
            <View style={{ flexDirection: "row", alignItems:"center" }}>
                <Text style={{ color : "#C62828" ,fontFamily:"Inter_18pt-Bold",fontSize: 17 }}>Hello </Text>
                {/* <Text style={{ color : "#9E9E9E" ,fontFamily:"Inter_18pt-Regular",fontSize: 17 }}>{user_name}</Text> */}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, justifyContent: "space-between" }}>
                <Text style={{ color : "#C62828", fontFamily: "Inter_18pt-Bold", fontSize : 34}}>Garage</Text>
                <Image
                    source={profile_picture ? { uri: profile_picture } : undefined}
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                />
            </View>
            <View style={{ marginTop: 30, flexDirection:"column", backgroundColor:"#C62828", width:"100%", height: 110, borderRadius: 10, padding: 20 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text 
                        style={{
                        fontSize: 15, 
                        fontFamily: "Inter_18pt-Regular", 
                        color: "#9E9E9E", 
                        marginRight: 4, // Add consistent spacing between texts
                        }}
                    >
                        My expenditure
                    </Text>
                    <Text 
                        style={{
                        fontSize: 10, // Match fontSize to align baselines
                        fontFamily: "Inter_18pt-Regular", 
                        color: "#ECEFF1",
                        
                        }}
                    >
                        ({monthName})
                    </Text>
                </View>
                <View>
                    <Text style={{fontSize: 34, fontFamily: "Inter_18pt-Bold", color: "#ECEFF1"}}>₹{monthly_expenditure}</Text>
                </View>
            </View>
            <View style={{ marginTop: 30, flexDirection:"column", backgroundColor:"#424242", opacity: 0.7137, width:"100%", height: 200, borderRadius: 10, padding: 15 }}>
                <Text style={{fontFamily: "Inter_18pt-SemiBold", color: "#8E8E93", fontSize: 20, margin: 0}}>Expenses</Text>
                <View style={{flexDirection:"row", justifyContent:"space-between", alignContent:"center"} }>
                    <View style={{flexDirection:"column", marginTop: 10, justifyContent:"center"}}>
                        {presentCategories.map((category) => {
    const icon = categoryIconMap[category];
    return icon ? (
        <View
            key={category}
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 4,
            }}
        >
            <View
                style={{
                    width: iconSize,
                    height: iconSize,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 8,
                }}
            >
                <MaterialCommunityIcons
                    name={icon.name}
                    size={iconSize}
                    color={icon.color}
                />
            </View>
            <Text
                style={{
                    color: "#ECEFF1",
                    fontSize: 14,
                    fontFamily: "Inter_18pt-Regular",
                }}
            >
                {category}
            </Text>
        </View>
    ) : null;
})}

                    </View>
                    <View>
                        {isLoading?(
                            <ActivityIndicator></ActivityIndicator>
                        ): (
            <PieChart
                widthAndHeight={widthAndHeight}
                series={series}
                cover={0.7}
            />)}
        
                    </View>
                </View>
            </View>
        </View>
    );
}