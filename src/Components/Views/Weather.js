import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, ScrollView, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import Unorderedlist from 'react-native-unordered-list';
import { weatherTheme } from '../colors';
import IMGBG from '../../Images/WeatherBg.jpg';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "63d5f96b4a950ab239091fa6823fcc9a";
const GEO_API = "AIzaSyC4sWTtahnDen60P06RSz-Z6F0-l_EMPYc";
const icons = {
    "Clouds" : {
      iconName: "cloudy",
      color: "#79797a",  
    },
    "Rain" : {
      iconName: "rains",
      color: "#3860ff",
    },
    "Clear" : {
      iconName: "day-sunny",
      color: "orange",
    },
    "Drizzle" : {
      iconName: "rain",
      color: "blue",
    },
    "Thunderstorm" : {
      iconName: "lightnings",
      color: "grey"
    },
    "Snow" : {
      iconName: "snowflake",
      color: "#e6e6e6",
    },
    "Atmosphere" : {
      iconName: "cloudy-gusts",
      color: "grey",
    },
    "Mist" : {
      iconName: "cloudy-gusts",
      color: "grey"
    },
    "Smoke" : {
      iconName: "fog",
      color: "grey"
    },
    "Haze" : {
      iconName: "cloudy-gusts",
      color: "grey"
    },
    "Dust": {
      iconName: "cloudy-gusts",
      color: "grey"
    },
    "Fog" : {
      iconName: "fog",
      color: "grey"
    },
    "Sand" : {
      iconName: "cloudy-gusts",
      color: "orange"
    },
    "Ash" : {
      iconName: "cloudy-gusts",
      color: "grey"
    },
    "Squall" : {
      iconName: "cloudy-gusts",
      color: "grey"
    },
    "Tornado": {
      iconName: "cloudy-gusts",
      color: "grey"
    },
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

    const [webWidth, setWebWidth] = useState(Dimensions.get("window").width);
  
  useEffect(() => {
    const updateLayout = () => {
      setWebWidth(Dimensions.get("window").width);
    };
    Dimensions.addEventListener("change", updateLayout);
    return () => {
      Dimensions.removeEventListener("change", updateLayout);
    };
  });

    const getWeather = async() => {
        const { granted } = await Location.requestForegroundPermissionsAsync();

        if(!granted){
            setOk(false);
        };

        const { coords: { latitude, longitude }} = await Location.getCurrentPositionAsync({ accuracy: 5 });

        Location.setGoogleApiKey(GEO_API);
        const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
        
        if(location[0].city === null){
          setCity(location[0].region);
        }
        else{
          setCity(location[0].city);
        };
    

        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
        const json = await response.json();
        /*
        const newDay = json.daily;
        setDays(newDay.slice(1));
        setDays(newDay);
        */
        setDays(json.daily);

        const currentArr = [];
        currentArr.push(json.current);
        setCurrents(currentArr);

        const hour = json.hourly;
        hour.splice(12);
      //setHours(hour.splice(12));
        setHours(hour);
    };

    return (
        <View style={styles.container}>
          {days.length === 0 ? (
            <View style={{...styles.loading}}>
              <ActivityIndicator size="large"/>
            </View>
          ) : (
          <View style={styles.container2}>
            <ImageBackground source={IMGBG} style={styles.image}>
              <View style={styles.city}>
                <Text style={styles.cityText}>{city}</Text>
              </View>
    
              <View style={styles.weather}>
    
                <View style={styles.daily}>
                  <View style={styles.currentStatus}>
                    {currents.map((current, index) =>
                      <View key={index} style={{ //currentIcon
                        width: webWidth >= 910 ? 900: webWidth - 10,
                        paddingHorizontal: 30,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}>
                        <Text style={styles.currentTemp}>{parseFloat(current.temp).toFixed(1)}°</Text>
                        <View style={styles.currentDescriptionBox}>
                            <Fontisto name={icons[current.weather[0].main].iconName} size={65} color={icons[current.weather[0].main].color} style={{ marginTop: 20 }}/> 
                            <Text style={styles.currentDescription}>{current.weather[0].main}</Text>
                        </View>
                      </View>
                      )}
                      <View style={styles.currMaxMin}>
                        <Unorderedlist bulletUnicode={0x2022} style={{ fontSize: 23 }}>
                            <Text style={styles.currMM}>MAX : {parseFloat(days[0].temp.max).toFixed(0)}°</Text>
                            </Unorderedlist>
                        <Unorderedlist bulletUnicode={0x2022} style={{ fontSize: 23 }}>
                            <Text style={styles.currMM}>MIN  : {parseFloat(days[0].temp.min).toFixed(0)}°</Text>
                        </Unorderedlist>
                      </View>
                  </View>
                </View>
                <View style={{ //hourbox
                  flex: 1.8,
                  alignItems: "center",
                }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} 
                  contentContainerStyle={{ //hourly
                  width: webWidth >= 910 ? 900: webWidth - 10,
                  flexDirection: "row",
                  paddingVertical: 10,
                  alignItems: "center",
                  borderBottomWidth: 0.5,
                  borderColor: weatherTheme.border,
                  }}>
                    {hours.map((hour, index) =>
                      <View key={index} style={{ //everyhour
                        flexDirection: "column",
                        width: 80,
                        alignItems: "center",
                        paddingHorizontal: 5,
                      }}>
                        <Text style={styles.hourlyTime}>{new Date(hour.dt*1000).getHours()}시</Text>
                        <Fontisto name={icons[hour.weather[0].main].iconName} size={25} color={icons[hour.weather[0].main].color} style={{marginTop: 10}}/>
                        <Text style={styles.hourlyTemp}>{parseFloat(hour.temp).toFixed(1)}°</Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
    
                <View style={styles.weekBox}>
                  <ScrollView pagingEnabled contentContainerStyle={styles.weekly}>
                  {days.map((day, index) => 
                    <View key={index} style={{ //everyweek
                      width: webWidth >= 910 ? 900: webWidth - 10,
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    
                    borderBottomWidth: 0.5,
                    borderColor: weatherTheme.weeklyBorder,
                    }}> 
                      <Text style={styles.date}>{new Date(day.dt*1000).toString().substring(4, 10)}</Text>
                      <Fontisto name={icons[day.weather[0].main].iconName} size={25} color={icons[day.weather[0].main].color} />
                      <Text style={styles.temp}>{parseFloat(day.temp.max).toFixed(0)}°</Text>
                      <Text style={styles.temp}>{parseFloat(day.temp.min).toFixed(0)}°</Text>
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
    alignItems: "flex-start"
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
    flex: 0.7,
    flexDirection: "row",
    width: 900,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cityText: {
    fontSize: 35,
    fontWeight: "500",
    color: "#2e2d2d"
  },

  weather: {
    flex: 10.5,
  },

  daily: {
    flex: 2.8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 0.5,
    borderColor: weatherTheme.border,
    
  },
  currentStatus: {
    marginVertical: 5,
  },
  /*
  currentIcon: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  */
  currentTemp: {
    fontSize: 80,
    fontWeight: "100",
    color: "black"
  },
  currentDescriptionBox: {
    marginTop: 10,
    alignItems: 'center',
  },
  currentDescription: {
    fontSize: 20,
    fontWeight: "200",
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
    fontWeight: '200',
  },
/*
  hourBox: {
    flex: 1.8,
  },
  hourly: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: weatherTheme.border,
  },
  everyHour: {
    flexDirection: "column",
    width: 80,
    alignItems: "center",
    paddingHorizontal: 5,
  },
  */
  hourlyTime: {
    fontSize: 20,
    fontWeight: '200',
    color: "white",
  },
  hourlyTemp: {
    fontSize: 18,
    fontWeight: '200',
    marginTop: 10,
    color: "white",
  },

  weekBox: {
    flex: 5.3,
    
  },
  weekly: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  /*
  everyWeek: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 10,
    
    borderBottomWidth: 0.5,
    borderColor: weatherTheme.weeklyBorder,
  },
  */
  date: {
    fontSize: 24,
    fontWeight: "200",
    color: "white",
  },
  days: {
    fontSize: 24,
    fontWeight: "200",
  },
  temp: {
    fontSize: 24,
    fontWeight: "200",
    color: "white",
  },
})