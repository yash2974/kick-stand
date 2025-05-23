import React, { use, useEffect } from "react";
import { View, Image, FlatList, TextInput, Button, Modal, ActivityIndicator, StyleSheet, TouchableOpacity} from "react-native";
import { ScrollView, Text, GestureHandlerRootView} from "react-native-gesture-handler";
import { AuthContext } from "../authstack/AuthContext";
import { useContext } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import PieChart from "react-native-pie-chart";
import DropdownComponent from "../Elements/DropDownComponent";
import DropdownComponentVehicle from "../Elements/DropDownComponentVehicle";
import CalenderComponent from "../Elements/CalenderComponent";


type UserDetails = {
    name: string;
    phone: string;
    email: string;
};

type Expense = {
    vehicle_id: string;
    user_id: string;
    amount: number;
    category: string;
    date: string;
};

export default function Garage() {
    const { userInfo } = useContext(AuthContext);
    const [userDetails, setUserDetails] = React.useState<UserDetails | null>(null);
    const [monthly_expenditure, setMonthlyExpenditure] = React.useState<number>(0);
    const [expenditure, setExpenditure] = React.useState<Expense[]>([]);
    const [isLoading, setIsLoading] = React.useState(true)
    const [isModalVisible, setIsModalVisible] = React.useState(false)
    const [isSeeAllVisible, setIsSeeAllVisible] = React.useState(false)
    const user_id = userInfo?.user.id;
    const profile_picture = userInfo?.user.photo;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // add leading zero
    const monthName = new Date().toLocaleString('default', { month: 'long' });
    const [categoryValue, setCategoryValue] = React.useState<string | null>(null)
    const [vehicleValue, setVehicleValue] = React.useState<string | null>(null)
    const [startDate, setStartDate] = React.useState<string | null>(null)
    const [endDate, setEndDate] = React.useState<string | null>(null)
    const [monthly_expenditure_data, setMonthlyExpenditureData] = React.useState<Expense[]>([]);

    

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

    const get_user_expenditure_monthly = async (params: { start_date: string; end_date: string; }) => {
        
        const response = await fetch(`http://192.168.1.8:8001/expenses/${user_id}?${params}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        setMonthlyExpenditureData(data)
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
        
        setIsLoading(false)
        
        
    }

    const setFilters = async (params: {categoryValue?: string, vehicleValue?: string, startDate?: string, endDate?: string}) => {
    const searchParams = new URLSearchParams();
    
    // Add parameters only if they exist
    if (params.categoryValue) searchParams.append('category', params.categoryValue);
    if (params.vehicleValue) searchParams.append('vehicle_id', params.vehicleValue);
    if (params.startDate) searchParams.append('start_date', params.startDate);
    if (params.endDate) searchParams.append('end_date', params.endDate);
    
    const queryString = searchParams.toString();
    const url = `http://192.168.1.8:8001/expenses/${user_id}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    setExpenditure(data);
    console.log("Filtered data:", data);
    console.log("URL used:", url);
}

    const categoryIconMap: { [key: string]: { name: string; color: string } } = {
        Fuel: { name: 'fuel', color: '#FF6B6B' },
        Service: { name: 'tools', color: '#FFA726' },
        Documents: { name: 'file-document-multiple', color: '#4CAF50' },
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

    // Format date to display as "May 21"
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const paramsAll = {
            start_date: `${year}-${month}-01`,
            end_date: `${year}-${month}-31`,
        }
    
    
    useEffect(() => {
        get_user_details();
        get_user_expenditure_monthly(paramsAll);
        get_user_expenditure();
    }, []);
    

    



    return (
        <View style={{ flex: 1, flexDirection:"column", backgroundColor: "#121212", padding: 25 }}>
            <View style={{ flexDirection: "row", alignItems:"center" }}>
                <Text style={{ color : "#C62828" ,fontFamily:"Inter_18pt-Bold",fontSize: 17 }}>Hello </Text>
                {/* <Text style={{ color : "#9E9E9E" ,fontFamily:"Inter_18pt-Regular",fontSize: 17 }}>{user_name}</Text> */}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
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
            <View style={{justifyContent:"center", alignItems:"center"}}>
                <View style={{ marginTop: 30, flexDirection:"column", backgroundColor:"#424242", opacity: 0.7137, width:"100%", height: 200, borderRadius: 10, padding: 15}}>
                    <Text style={{fontFamily: "Inter_18pt-SemiBold", color: "#8E8E93", fontSize: 20, margin: 0}}>Expenses</Text>
                    <View style={{flexDirection:"row", justifyContent:"space-between", alignContent:"center",alignItems:"center"} }>
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
                                                color: "#AEAEB2",
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
                        <View style={{ paddingHorizontal:10}}>
                            {isLoading?(
                                <ActivityIndicator></ActivityIndicator>
                            ): (
                                <PieChart
                                    widthAndHeight={widthAndHeight}
                                    series={series}
                                    cover={0.65}
                                    
                                />)}
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor:"#1F1F1F", height:10, width:"90%", borderBottomEndRadius:10,borderBottomLeftRadius:10}}>
                </View>
            </View>
            <View style={{flexDirection:"column", marginTop:15}}>
                <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"baseline"}}>
                    <View>
                        <Text style={{ fontFamily :"Inter_18pt-Bold", fontSize:22, color:"#C62828"}}>Wallet</Text>
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <TouchableOpacity onPress={()=>{
                            setIsModalVisible(true)
                            }}>
                        <Text style={{fontFamily:"Inter_18pt-Regular", color:"#AEAEB2", fontSize:15, marginRight:6}}>
                            Filter    
                        </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            get_user_expenditure_monthly(paramsAll)
                            setIsSeeAllVisible(true)
                        }}>
                        <Text style={{fontFamily:"Inter_18pt-Regular", color:"#ECEFF1", fontSize:15}}>
                            See all
                        </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <GestureHandlerRootView style={{height: 160}}>
                    <ScrollView style={{marginTop: 15}}>
                        {expenditure.map((expense, index) => (
                            <View key={index} style={styles.expenseItem}>
                                <View style={styles.expenseLeftSection}>
                                    <View style={[styles.categoryIcon, {backgroundColor: categoryIconMap[expense.category]?.color || '#9E9E9E'}]}>
                                        <MaterialCommunityIcons
                                            name={categoryIconMap[expense.category]?.name || 'cash'}
                                            size={20}
                                            color="#FFFFFF"
                                        />
                                    </View>
                                    <View style={styles.expenseDetails}>
                                        <Text style={styles.expenseCategory}>{expense.category}</Text>
                                        <Text style={styles.vehicleId}>{expense.vehicle_id}</Text>
                                    </View>
                                </View>
                                <View style={styles.expenseRightSection}>
                                    <Text style={styles.expenseAmount}>₹{expense.amount}</Text>
                                    <Text style={styles.expenseDate}>{formatDate(expense.date)}</Text>
                                </View>
                            </View>
                        ))}
                        {expenditure.length === 0 && !isLoading && (
                            <View style={styles.noExpensesContainer}>
                                <Text style={styles.noExpensesText}>No expenses found</Text>
                            </View>
                        )}
                        {isLoading && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator color="#C62828" />
                                <Text style={styles.loadingText}>Putting on Kickstand...</Text>
                            </View>
                        )}
                    </ScrollView>
                </GestureHandlerRootView>
            </View>
            <Modal transparent={true} visible={isModalVisible} animationType="fade" onRequestClose={()=>{setIsModalVisible(false)} }>
                
                <View style={{flex:1, justifyContent: 'center', alignItems:'center',backgroundColor:"rgba(0, 0, 0, 0.8)" }}>
                <View style={{flexDirection:"column",width: 300,backgroundColor:"#121212",borderRadius:10, padding:20}}>
                    <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter_18pt-SemiBold", fontSize:20, color:"#C62828"}}>Filter</Text>
                    <TouchableOpacity onPress={()=>{setIsModalVisible(false)}}>
                    <MaterialCommunityIcons style={{marginTop:8}}name="close" size={20} color="#900" />
                    </TouchableOpacity>
                    </View>
                    <View style={{justifyContent:"center", alignItems:"center"}}>
                        <View style={{flexDirection:"row", justifyContent:"space-between",width:"100%",marginTop:10}}>
                            <DropdownComponent categoryValue={categoryValue} setCategoryValue={setCategoryValue}></DropdownComponent>
                            <DropdownComponentVehicle vehicleValue={vehicleValue} setVehicleValue={setVehicleValue}></DropdownComponentVehicle>
                        </View>
                        <CalenderComponent startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}></CalenderComponent>
                    <TouchableOpacity style={{backgroundColor:"#C62828", width:110, height:30, justifyContent:"center",alignItems:"center", borderRadius:10,marginTop:10, }} 
                        onPress={()=>{
                            const paramsFilter = {
                                categoryValue: categoryValue ?? undefined,
                                vehicleValue: vehicleValue ?? undefined,
                                startDate: startDate ?? undefined,
                                endDate: endDate ?? undefined
                            }
                            setFilters(paramsFilter)
                            setIsModalVisible(false)
                    }}>
                        <Text style={{fontFamily:"Inter_18pt-SemiBold", color:"#ECEFF1"}}>Apply Filters</Text>
                    </TouchableOpacity>
                    
                    </View>
                </View>
                </View>
            </Modal>
            <Modal transparent={true} visible={isSeeAllVisible} animationType="fade" onRequestClose={()=>{setIsSeeAllVisible(false)} }>
                <View style={{flex: 1, backgroundColor: "#121212", padding:20 }}>
                    <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"baseline"}}>
                        <Text style={{ fontFamily :"Inter_18pt-Bold", fontSize:22, color:"#C62828"}}>Wallet</Text>
                        <TouchableOpacity onPress={()=>{setIsSeeAllVisible(false)}}>
                            <MaterialCommunityIcons style={{marginTop:8}}name="close" size={20} color="#900" />
                        </TouchableOpacity>
                    </View>
                    <View>
                    <GestureHandlerRootView style={{flexGrow:1}}>
                    <ScrollView style={{marginTop: 15}}>
                        {monthly_expenditure_data.map((expense, index) => (
                            <View key={index} style={styles.expenseItem}>
                                <View style={styles.expenseLeftSection}>
                                    <View style={[styles.categoryIcon, {backgroundColor: categoryIconMap[expense.category]?.color || '#9E9E9E'}]}>
                                        <MaterialCommunityIcons
                                            name={categoryIconMap[expense.category]?.name || 'cash'}
                                            size={20}
                                            color="#FFFFFF"
                                        />
                                    </View>
                                    <View style={styles.expenseDetails}>
                                        <Text style={styles.expenseCategory}>{expense.category}</Text>
                                        <Text style={styles.vehicleId}>{expense.vehicle_id}</Text>
                                    </View>
                                </View>
                                <View style={styles.expenseRightSection}>
                                    <Text style={styles.expenseAmount}>₹{expense.amount}</Text>
                                    <Text style={styles.expenseDate}>{formatDate(expense.date)}</Text>
                                </View>
                            </View>
                        ))}
                        {expenditure.length === 0 && !isLoading && (
                            <View style={styles.noExpensesContainer}>
                                <Text style={styles.noExpensesText}>No expenses found</Text>
                            </View>
                        )}
                        {isLoading && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator color="#C62828" />
                                <Text style={styles.loadingText}>Putting on Kickstand...</Text>
                            </View>
                        )}
                    </ScrollView>
                    </GestureHandlerRootView>
                    </View>
                </View>
            </Modal>
        
            
        </View>
    );
}

const styles = StyleSheet.create({
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1F1F1F',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    expenseLeftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    expenseDetails: {
        flexDirection: 'column',
    },
    expenseCategory: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Inter_18pt-SemiBold',
    },
    vehicleId: {
        color: '#8E8E93',
        fontSize: 14,
        fontFamily: 'Inter_18pt-Regular',
        marginTop: 4,
    },
    expenseRightSection: {
        alignItems: 'flex-end',
    },
    expenseAmount: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Inter_18pt-SemiBold',
    },
    expenseDate: {
        color: '#8E8E93',
        fontSize: 14,
        fontFamily: 'Inter_18pt-Regular',
        marginTop: 4,
    },
    noExpensesContainer: {
        padding: 20,
        alignItems: 'center',
    },
    noExpensesText: {
        color: '#8E8E93',
        fontFamily: 'Inter_18pt-Regular',
        fontSize: 16,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        color: '#8E8E93',
        fontFamily: 'Inter_18pt-Regular',
        fontSize: 16,
        marginTop: 8,
    },
});
