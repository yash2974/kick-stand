import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { Button, TouchableOpacity, View, Text } from 'react-native';


interface CalenderComponentProps {
    startDate: string | null;
    setStartDate: (date: string | null) => void;
    endDate: string | null;
    setEndDate: (date: string | null) => void;
}

const CalenderComponent: React.FC<CalenderComponentProps> = ({startDate, setStartDate, endDate, setEndDate}) => {
  

interface Day {
    dateString: string;
    day: number;
    month: number;
    year: number;
    timestamp: number;
}

const onDayPress = (day: Day): void => {
    if (!startDate || (startDate && endDate)) {
        // Start new selection
        setStartDate(day.dateString);
        setEndDate(null);
    } else if (!endDate) {
        // Set end date only if it's after the start date
        if (new Date(day.dateString) > new Date(startDate)) {
            setEndDate(day.dateString);
        } else {
            // If selected date is before start, reset selection
            setStartDate(day.dateString);
        }
    }
};

  const getMarkedDates = () => {
  if (!startDate) return {};

  let marked: { [date: string]: { startingDay?: boolean; endingDay?: boolean; color: string; textColor: string } } = {};

  if (!endDate || startDate === endDate) {
    // Single day selection
    marked[startDate] = {
      startingDay: true,
      endingDay: true,
      color: '#C62828',
      textColor: '#ECEFF1'
    };
  } else {
    // Range selection
    let current = new Date(startDate);
    let end = new Date(endDate);

    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      marked[dateStr] = {
        color: '#C62828',
        textColor: '#ECEFF1'
      };
      current.setDate(current.getDate() + 1);
    }

    marked[startDate].startingDay = true;
    marked[endDate].endingDay = true;
  }

  return marked;
};

  return (
    <View>
        <View style={{width:260, marginTop:15, borderRadius: 10, overflow: 'hidden'}}>
        <Calendar
            markingType={'period'}
            markedDates={getMarkedDates()}
            onDayPress={onDayPress}
            theme={{
                calendarBackground:"#424242",
                textSectionTitleColor: '#ECEFF1',
                monthTextColor:"#EF6C00",
                dayTextColor: '#C62828',
                todayTextColor: '#EF6C00',
                arrowColor: '#EF6C00',
            }}
        />
        </View>
        <View style={{justifyContent:"center"}}>
        <TouchableOpacity style={{}} onPress={() => {
            setStartDate(null);
            setEndDate(null);
            }}>
            <Text style={{color:"#424242", fontFamily:"Inter_18pt-Regular", fontSize:12,}}>
                Clear Selection
            </Text>
        </TouchableOpacity>
        </View>

    </View>

  );
};

export default CalenderComponent;
