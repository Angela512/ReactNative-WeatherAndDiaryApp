import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect }from 'react';
import { ImageBackground, Platform, StyleSheet, ScrollView, Text, View, Alert, TouchableOpacity, Dimensions } from 'react-native';
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
  
  const deleteLog = (key) => {
    if(Platform.OS === "web"){
      const ok = confirm("Do you want to delete this To-Do?");
      if(ok){
        const newDiary = {...diary};
        delete newDiary[key];
        setDiary(newDiary);
        saveDiary(newDiary);
      }
    } else {
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
  };


  return(
    <View style={styles.container}>
      <ImageBackground source={IMGBG} style={styles.image}>
        <ScrollView contentContainerStyle={styles.logBox}>
          {Object.keys(diary).map((key) =>
          
            <View key={key} style={{ //diary
              backgroundColor: historyTheme.historyBg,
              width: webWidth >= 910 ? 900: webWidth - 10,
              marginBottom: 10,
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 15,
              alignItems: "flex-start",
              justifyContent: "center",
            }}>
              
              <View style={{ //dayAndMoodBox
                flexDirection: "row",
                width: webWidth >= 910 ? 870: webWidth - 40,
                justifyContent: "space-between",
              }}>
                <Text style={styles.logDay}>{key.substring(4,10)} {key.substring(0,3)} {key.substring(16,21)}</Text>
                <FontAwesome5 name={moods[diary[key].mood]} size={17} color="black"/>
              </View>
              <View style={{ //DiaryAndDeleteBox
                flex: 1.3,
                width: webWidth >= 910 ? 870: webWidth - 40,
              }}>
              <Text style={styles.logText}>{diary[key].diary}</Text>
            
            <TouchableOpacity style={styles.deleteBtn} 
            onPress={() => deleteLog(key)}
            hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} >
            <Fontisto name="trash" size={15} color={historyTheme.trashIcon} />
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
  /*
  DiaryAndDeleteBox: {
    flex: 1.3,
    width: SCREEN_WIDTH-40,
  },
  */
  deleteBtn: {
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: "flex-end",
    backgroundColor: "white",
    
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
/*
  diary: {
    backgroundColor: historyTheme.historyBg,
    width: SCREEN_WIDTH-10,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: "flex-start",
    justifyContent: "center",
  },
*/
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
    fontSize: 15,
    fontWeight: "300",
    paddingVertical: 5,
    paddingRight: 5,
  }
});