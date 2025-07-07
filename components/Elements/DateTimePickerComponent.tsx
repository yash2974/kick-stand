import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  onStartChange: (val: string) => void;
  onEndChange: (val: string) => void;
};

export const DateTimePickerComponent = ({ onStartChange, onEndChange }: Props) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [isStart, setIsStart] = useState(true); // Which field is being edited
    const [start, setStart] = useState("none");
    const [end, setEnd] = useState("none");

    const formatDateTime = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    const onChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
        if (isStart) {
            setStartDate(selectedDate);
            const formatted = formatDateTime(selectedDate);
            setStart(formatted);
            onStartChange(formatted);
        } else {
            setEndDate(selectedDate);
            const formatted = formatDateTime(selectedDate);
            setEnd(formatted);
            onEndChange(formatted);
        }
        }
        setShowPicker(false);
    };

    const showPickerFor = (type: 'start' | 'end', pickerMode: 'date' | 'time') => {
        setIsStart(type === 'start');
        setMode(pickerMode);
        setShowPicker(true);
    };

    return (
        <SafeAreaView>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 8 }}>
                <View>
                    <Button title="Start Date" onPress={() => showPickerFor('start', 'date')} />
                    <Button title="Start Time" onPress={() => showPickerFor('start', 'time')} />
                </View>
                <View>
                    <Button title="End Date" onPress={() => showPickerFor('end', 'date')} />
                    <Button title="End Time" onPress={() => showPickerFor('end', 'time')} />
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
