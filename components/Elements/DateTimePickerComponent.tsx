import React, { useState } from "react";
import { Button, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  onStartChange: (val: string) => void;
  onEndChange: (val: string) => void;
};

export const DateTimePickerComponent = ({ onStartChange, onEndChange }: Props) => {
    const [startDate, setStartDate] = useState(new Date());
    const [startDateString, setStartDateString] = useState("");
    const [endDate, setEndDate] = useState(new Date());
    const [endDateString, setEndDateString] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [isStart, setIsStart] = useState(true); // Which field is being edited
    const [start, setStart] = useState("none");
    const [end, setEnd] = useState("none");

    const formatDateTime = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    const onChange = (event: any, selectedDate?: Date) => {
  if (!selectedDate) {
    setShowPicker(false);
    return;
  }

  if (mode === 'date') {
    if (isStart) {
      setStartDate(selectedDate);
    } else {
      setEndDate(selectedDate);
    }
    // Immediately open time picker for the same type
    setMode('time');
    setShowPicker(true);
    return;
  }

  if (mode === 'time') {
    if (isStart) {
      setStartDate(selectedDate);
      const formatted = formatDateTime(selectedDate);
      setStart(formatted);
      onStartChange(formatted);
      setStartDateString("Start: " + selectedDate.toLocaleString());
    } else {
      setEndDate(selectedDate);
      const formatted = formatDateTime(selectedDate);
      setEnd(formatted);
      onEndChange(formatted);
      setEndDateString("End: " + selectedDate.toLocaleString());
    }
    setShowPicker(false);
  }
};


    const showPickerFor = (type: 'start' | 'end', pickerMode: 'date' | 'time') => {
        setIsStart(type === 'start');
        setMode(pickerMode);
        setShowPicker(true);
    };

    return (
        <SafeAreaView>
            <View style={{marginBottom: 8}}>
                <View style={{flexDirection: "column"}} >
                    <TouchableOpacity style={{flexDirection: "row", alignItems: "center", marginBottom: 10}} onPress={() => showPickerFor('start', 'date')}>
                        <Image source={require('../../assets/photos/calendar.png')} style={{ width: 30, height: 30 }}/>
                        <Text style={{
                        marginHorizontal: 6,
                        color: "#66BB6A",
                        fontSize: 12,
                        marginVertical: 8,
                        textAlignVertical: "top",
                        fontFamily: "Inter_18pt-Regular",
                        marginLeft: 10
                    }}>{startDateString ? startDateString : "Select Start Time"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection: "row", alignItems: "center"}} onPress={() => showPickerFor('end', 'date')}>
                        <Image source={require('../../assets/photos/calendar.png')} style={{ width: 30, height: 30 }}/>
                        <Text style={{
                        marginHorizontal: 6,
                        color: "#66BB6A",
                        fontSize: 12,
                        marginVertical: 8,
                        textAlignVertical: "top",
                        fontFamily: "Inter_18pt-Regular",
                        marginLeft: 10
                    }}>{endDateString ? endDateString : "Select End Time"}</Text>
                    </TouchableOpacity>
                </View>
                    
            </View>



            {showPicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={isStart ? startDate : endDate}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
        </SafeAreaView>
    );
};
