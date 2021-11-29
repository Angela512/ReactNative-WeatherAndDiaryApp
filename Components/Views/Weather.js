import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Unorderedlist from 'react-native-unordered-list';
import { weatherTheme } from './colors';
import IMGBG from '../../Images/WeatherBg.jpg';

/*
const config = require('../../../config/key');
const API_KEY = config.API_KEY;
*/
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "63d5f96b4a950ab239091fa6823fcc9a";

const icons = {
    "Clouds" : "cloudy",
    "Rain" : "rains",
    "Clear" : "day-sunny",
    "Drizzle" : "rain",
    "Thunderstorm" : "lightnings",
    "Snow" : "snowflake",
    "Atmosphere" : "cloudy-gusts",
    "Mist" : "cloudy-gusts",
    "Smoke" : "fog",
    "Haze" : "cloudy-gusts",
    "Dust": "cloudy-gusts",
    "Fog" : "fog",
    "Sand" : "cloudy-gusts",
    "Ash" : "cloudy-gusts",
    "Squall" : "cloudy-gusts",
    "Tornado" : "cloudy-gusts",
  };




export default function Weather() {
    const [city, setCity] = useState("Finding your location...");
    const [ok, setOk] = useState(true);
    const [currents, setCurrents] = useState([]);
    const [hours, setHours] = useState([]);
    const [days, setDays] = useState([]);

    useEffect(() => {
        getWeather();
    }, []);

    const getWeather = async() => {
        const { granted } = await Location.requestBackgroundPermissionsAsync();

        if(!granted){
            setOk(false);
        };

        const { coords: { latitude, longitude }} = await Location.getCurrentPositionAsync({ accuracy: 5 });
        const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });

        if(location[0].city === null){
            setCity(location[0].region);
        } else{
            setCity(location[0].city);
        };

        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
        const json = await response.json();
        const newDay = json.daily;
        setDays(newDay.slice(1));

        const currentArr = [];
        currentArr.push(json.current);
        setCurrents(currentArr);

        const hour = json.hourly;
        hour.splice(12);
        setHours(hour);

    };

    return (
        <View style={styles.container}>
          {days.length === 0 ? (
            <View style={{ ...styles.loading, alignItems: "center" }}>
              <ActivityIndicator size="large"/>
            </View>
          ) : (
          <View style={styles.container2}>
            <ImageBackground source={IMGBG} style={styles.image}>
              <View style={styles.city}>
                <Text style={styles.cityText}>Current City : {city}</Text>
              </View>
    
              <View style={styles.weather}>
    
                <View style={styles.daily}>
                  <View style={styles.currentStatus}>
                    {currents.map((current, index) =>
                      <View key={index} style={styles.currentIcon}>
                        <Text style={styles.currentTemp}>{parseFloat(current.temp).toFixed(1)}°C</Text>
                        <View style={styles.currentDescriptionBox}>
                            <Fontisto name={icons[current.weather[0].main]} size={65} color="black" style={{ marginTop: 20 }}/> 
                            <Text style={styles.currentDescription}>{current.weather[0].main}</Text>
                        </View>
                      </View>
                      )}
                      <View style={styles.currMaxMin}>
                        <Unorderedlist bulletUnicode={0x2022} style={{ fontSize: 23 }}>
                            <Text style={styles.currMM}>MAX : {parseFloat(days[0].temp.max).toFixed(0)}°C</Text>
                            </Unorderedlist>
                        <Unorderedlist bulletUnicode={0x2022} style={{ fontSize: 23 }}>
                            <Text style={styles.currMM}>MIN : {parseFloat(days[0].temp.min).toFixed(0)}°C</Text>
                        </Unorderedlist>
                      </View>
                  </View>
                </View>
                <View style={styles.hourBox}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourly}>
                    {hours.map((hour, index) =>
                      <View key={index} style={styles.everyHour}>
                        <Text style={styles.hourlyTime}>{new Date(hour.dt*1000).getHours()}시</Text>
                        <Fontisto name={icons[hour.weather[0].main]} size={25} color="black" style={{marginTop: 10}}/>
                        <Text style={styles.hourlyTemp}>{parseFloat(hour.temp).toFixed(1)}</Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
    
                <View style={styles.weekBox}>
                  <ScrollView pagingEnabled contentContainerStyle={styles.weekly}>
                  {days.map((day, index) => 
                    <View key={index} style={styles.everyWeek}>
                      <Text style={styles.date}>{new Date(day.dt*1000).toString().substring(4, 10)}</Text>
                      <Fontisto name={icons[day.weather[0].main]} size={25} color="black"/>
                      <Text style={styles.temp}>{parseFloat(day.temp.max).toFixed(0)}°C</Text>
                      <Text style={styles.temp}>{parseFloat(day.temp.min).toFixed(0)}°C</Text>
                    </View>
                  )}
                  </ScrollView>
                </View>
              </View>
            </ImageBackground>
          </View>
          )}
        </View>
      );

    
}

    const styles = StyleSheet.create({
        container: {
          flex: 1,
        },
        loading: {
          width: SCREEN_WIDTH,
          marginTop: '80%',
          alignItems: "center"
        },
      
        container2: {
          flex: 1,
          flexDirection: "column",
        },
      
        image: {
          flex: 1,
          resizeMode: "cover",
          justifyContent: "center",
        },
      
        city: {
          flex: 0.5,
          flexDirection: "row",
          paddingVertical: 10,
          alignItems: "center",
          justifyContent: "center",
          borderBottomWidth: 1,
          borderColor: weatherTheme.border,
          //backgroundColor: "tomato",
        },
        cityText: {
          fontSize: 25,
          fontWeight: "500",
        },
      
        weather: {
          flex: 10.5,
        },
      
        daily: {
          flex: 2.8,
          paddingVertical: 10,
          alignItems: "center",
          justifyContent: "center",
          borderBottomWidth: 1,
          borderColor: weatherTheme.border,
          //backgroundColor: "orange"
        },
        currentStatus: {
          marginVertical: 5,
        },
        currentIcon: {
          width: SCREEN_WIDTH,
          paddingHorizontal: 30,
          flexDirection: "row",
          justifyContent: "space-between",
        },
        currentTemp: {
          fontSize: 80,
          fontWeight: "600",
        },
        currentDescriptionBox: {
          marginTop: 10,
          alignItems: 'center',
        },
        currentDescription: {
          fontSize: 20,
          fontWeight: "500",
          marginTop: 10,
        },
        currMaxMin: {
          marginTop: -20,
          marginBottom: 15,
          paddingHorizontal: 30,
          alignItems: "flex-start",
        },
        currMM: {
          fontSize: 22,
          fontWeight: '500',
        },
      
        hourBox: {
          flex: 1.8,
        },
        hourly: {
          flexDirection: "row",
          paddingVertical: 10,
          alignItems: "center",
          borderBottomWidth: 1,
          borderColor: weatherTheme.border,
          //backgroundColor: "teal",
        },
        everyHour: {
          flexDirection: "column",
          width: 80,
          alignItems: "center",
          paddingHorizontal: 5,
        },
        hourlyTime: {
          fontSize: 20,
          fontWeight: '500',
        },
        hourlyTemp: {
          fontSize: 18,
          fontWeight: '500',
          marginTop: 10,
        },
      
        weekBox: {
          flex: 5.3,
          //backgroundColor: "coral",
        },
        weekly: {
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          paddingVertical: 5,
        },
        everyWeek: {
          width: SCREEN_WIDTH,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          marginVertical: 5,
          paddingHorizontal: 10,
          borderBottomWidth: 1,
          borderColor: weatherTheme.weeklyBorder,
        },
        date: {
          fontSize: 24,
          fontWeight: "500",
        },
        days: {
          fontSize: 24,
          fontWeight: "500",
        },
        temp: {
          fontSize: 24,
          fontWeight: "500",
        },
})