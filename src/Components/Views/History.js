import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect }from 'react';
import { ImageBackground, StyleSheet, ScrollView, Text, View, Alert, TouchableOpacity, Dimensions } from 'react-native';
import IMGBG from '../../Images/HistoryBg.jpg';
import { historyTheme } from '../colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const STORAGE_KEY = "@dailyLog";

const moods = {
  "Excited" : "laugh-squint",
  "Good" : "smile",
  "Meh" : "meh",
  "Bad" : "frown",
  "Sad" : "sad-tear",
  "Angry" : "angry",
  "In Love" : "kiss-wink-heart",
};

export default function History(){
  const [diary, setDiary] = useState({});

  const saveDiary = async(toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadDiary = async() => {
    try{
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if(s){
        setDiary(JSON.parse(s)); 
      }
    }
    catch(e){
      Alert.alert("Error", "History Function is not loaded!");
      console.log(e);
    }
  }
  useEffect(() => {
    loadDiary();
  }, []);

  const deleteLog = (key) => {
    try{
      Alert.alert(
        "Delete",
        "Are you sure?", [
          {text: "Cancel", style: "destructive"},
          {
            text: "Yes",
            onPress: () => {
              const newDiary = {...diary};
              delete newDiary[key];
              setDiary(newDiary);
              saveDiary(newDiary);
            }
          }
        ]
      );
      
    }
    catch(e){
      Alert.alert("Error", "History is empty");
      console.log(e);
    }
  };


  return(
    <View style={styles.container}>
      <ImageBackground source={IMGBG} style={styles.image}>
        <ScrollView contentContainerStyle={styles.logBox}>
          {diary && Object.keys(diary).map((key) =>
          
            <View key={key} style={styles.diary}>
              <View style={styles.dayAndMoodBox}>
                <Text style={styles.logDay}>{key.substring(4, 15)}</Text>
                <FontAwesome5 name={moods[diary[key].mood]} size={17} color="black"/>
              </View>
              <Text style={styles.logText}>{diary[key].diary}</Text>
            <View style={styles.submit}>
            <TouchableOpacity style={styles.submitPress} onPress={() => deleteLog(key)}>
            <Fontisto name="trash" size={15} color="black" />
          </TouchableOpacity>
            </View>
            
            </View>
            
          )}
        

        
          
          
          
        

        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  submit: {
    flex: 1.3,
    paddingRight: 10,
    alignItems: "stretch",
    justifyContent: "center",
    flexDirection: "column",
    
  },

  container: {
    flex: 1,
  },

  image: {
    flex: 1,
    justifyContent: "center",
  },

  logBox: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  diary: {
    backgroundColor: historyTheme.historyBg,
    width: SCREEN_WIDTH-10,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  dayAndMoodBox: {
    flexDirection: "row",
    width: SCREEN_WIDTH-40,
    justifyContent: "space-between",
  },
  logDay: {
    fontSize: 13,
    fontWeight: "200",
  },

  logText: {
    fontSize: 20,
    fontWeight: "400",
  }
});