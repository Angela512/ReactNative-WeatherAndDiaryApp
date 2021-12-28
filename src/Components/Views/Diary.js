import React, { useEffect, useState } from 'react';
import { ImageBackground, Platform, StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IMGBG from '../../Images/DiaryBg.jpg';
import { diaryTheme } from '../colors';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SIZE = 30;

const STORAGE_KEY = "@dailyLog";

const mon = {
  "0" : "JAN",
  "1" : "FEB",
  "2" : "MAR",
  "3" : "APR",
  "4" : "MAY",
  "5" : "JUN",
  "6" : "JUL",
  "7" : "AUG",
  "8" : "SEP",
  "9" : "OCT",
  "10" : "NOV",
  "11" : "DEC",
};

export default function Diary(){
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [diary, setDiary] = useState("");
  const [dailyLog, setDailyLog] = useState({});
  
  const today = new Date();
  const month = today.getMonth();
  const date = today.getDate();

  const onChangeText = (payload) => setText(payload);
  const onChangeMood = (sticker) => setMood(sticker);
  const dismissKeyboard = () => Keyboard.dismiss();

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

  const saveLog = async(toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadLogs = async() => {
    try{
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if(s){
        setDailyLog(JSON.parse(s));
      }
    }
    catch(e){
      Alert.alert("Error", "Diary Function is not loaded");
      console.log(e);
    }
  };
  useEffect(() => {
    loadLogs();
  }, []);

  const addDiary = () => {
    if(text === ""){
      return
    }
    setDiary(text);
    saveLog(text);
    
  };

  const onPressSave = () => {
    if(Platform.OS === "web"){
      const ok = confirm("Do you want to save your diary?");
      if(ok){
        const newDailyLog = {
          ...dailyLog,
          [today] : { diary, mood },
        };
        setDailyLog(newDailyLog);
        saveLog(newDailyLog);
        setText("");
        
      }
    } else {
      Alert.alert(
        "Save your diary?",
        "You can't edit today's diary once you save", [
          { text: "Cancel" , style: "destructive"},
          { text: "Yes", onPress: () => {
              Alert.alert("Saved");
              const newDailyLog = {
                ...dailyLog,
                [today] : { diary, mood },
              };
              setDailyLog(newDailyLog);
              saveLog(newDailyLog);
              setText("");
            }
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={IMGBG} style={styles.image}>
        <View style={styles.date}>
          <Text style={styles.dateText}>{mon[month]} {date}</Text>
        </View>

        <View style={styles.diary}>
          
          <View style={styles.inputBox}>
            <TextInput
              editable={true}
              onChangeText={onChangeText}
              value={text}
              placeholder={"Write down here"}
              multiline={true}
              style={{
                width : webWidth >= 910 ? 900: webWidth - 10,
                minHeight: "40%",
                backgroundColor: "white",
                textAlignVertical: "top",
                paddingVertical: 30,
                paddingHorizontal: 30,
                marginVertical: 10,
                borderRadius: 30,
                opacity: 0.85,
                fontSize: 18,
              }} />
              <TouchableOpacity style={styles.textBtn} onPress={addDiary} onPressOut={dismissKeyboard}>
                <Text style={styles.DoneText}>Done</Text>
              </TouchableOpacity>
          </View>
          
        </View>

        <View style={styles.mood}>
          <Text style={styles.moodText}>Select Your Mood</Text>
          <View style={{
            width : webWidth >= 910 ? 900: webWidth - 10,
            flexDirection: "row",
            paddingHorizontal: 20,
            paddingVertical: 20,
            justifyContent: "space-between",
          }}>
            
            <TouchableOpacity
              onPress={() => onChangeMood("Excited")}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} >
              {(mood === "Excited") ? (
                <FontAwesome5 name="laugh-squint" size={SIZE+5} color={diaryTheme.moodSelect} />
              ) : (
                <FontAwesome5 name="laugh-squint" size={SIZE} color={diaryTheme.moodBasic} />
              )}
            </TouchableOpacity>
            

            
            
            <TouchableOpacity
              onPress={() => onChangeMood("Good")}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} >
              {(mood === "Good") ? (
                <FontAwesome5 name="smile" size={SIZE+5} color={diaryTheme.moodSelect} />
              ) : (
                <FontAwesome5 name="smile" size={SIZE} color={diaryTheme.moodBasic} />
              )}
            </TouchableOpacity>
            

            
            <TouchableOpacity
              onPress={() => onChangeMood("Meh")}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} >
              {(mood === "Meh") ? (
                <FontAwesome5 name="meh" size={SIZE+5} color={diaryTheme.moodSelect} />
              ) : (
                <FontAwesome5 name="meh" size={SIZE} color={diaryTheme.moodBasic} />
              )}
            </TouchableOpacity>
            

            
            <TouchableOpacity
              onPress={() => onChangeMood("Bad")}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} >
              {(mood === "Bad") ? (
                <FontAwesome5 name="frown" size={SIZE+5} color={diaryTheme.moodSelect} />
              ) : (
                <FontAwesome5 name="frown" size={SIZE} color={diaryTheme.moodBasic} />
              )}
            </TouchableOpacity>
            


            
            <TouchableOpacity
              onPress={() => onChangeMood("Sad")}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} >
              {(mood === "Sad") ? (
                <FontAwesome5 name="sad-tear" size={SIZE+5} color={diaryTheme.moodSelect} />
              ) : (
                <FontAwesome5 name="sad-tear" size={SIZE} color={diaryTheme.moodBasic} />
              )}
            </TouchableOpacity>
            

            
            <TouchableOpacity
              onPress={() => onChangeMood("Angry")}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} >
              {(mood === "Angry") ? (
                <FontAwesome5 name="angry" size={SIZE+5} color={diaryTheme.moodSelect} />
              ) : (
                <FontAwesome5 name="angry" size={SIZE} color={diaryTheme.moodBasic} />
              )}
            </TouchableOpacity>
            

            
            <TouchableOpacity
              onPress={() => onChangeMood("In Love")}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} >
              {(mood === "In Love") ? (
                <FontAwesome5 name="kiss-wink-heart" size={SIZE+5} color={diaryTheme.moodSelect} />
              ) : (
                <FontAwesome5 name="kiss-wink-heart" size={SIZE} color={diaryTheme.moodBasic} />
              )}
            </TouchableOpacity>
            
          </View>
        </View>

        <View style={styles.submit}>
          <View style={{
            width: webWidth >= 910 ? 900: webWidth - 10,
            alignItems: "flex-end",
          }}>
          <TouchableOpacity onPress={onPressSave} style={styles.submitPress}>
            <Text style={styles.submitText}>Save ✓</Text>
          </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  submitstyle: {
    width: 900,
    alignItems: "flex-end",
  },

  container: {
    flex: 1,
  },

  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },

  date: {
    flex: 0.7,
    paddingVertical: 10,
    marginLeft: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
  },
  dateText: {
    fontSize: 28,
    fontWeight: "300",
  },

  diary: {
    flex: 7,
    alignItems: 'center',
  },
  inputBox: {
    alignItems: "flex-end",
  },
  textBtn: {
    margin: 10,
    alignItems: "center",
    backgroundColor: diaryTheme.diaryText,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  DoneText: {
    fontSize: 18,
    fontWeight: "400",
  },

  mood: {
    flex: 2,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: diaryTheme.moodBg,
    opacity: 0.8,
  },
  moodText: {
    fontSize: 28,
    fontWeight: "300",
  },
  
  submit: {
    flex: 1.3,
    paddingRight: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    
  },
  
  submitPress: {
    width: 100,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: diaryTheme.diarySubmit,
  },
  submitText: {
    fontSize: 22,
    fontWeight: "500",
  },

});