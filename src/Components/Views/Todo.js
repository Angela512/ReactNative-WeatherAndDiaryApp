import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Platform, Text, View, TextInput, TouchableOpacity, ScrollView, Dimensions, Alert, ImageBackground } from 'react-native';
import { toDoTheme } from "../colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import IMGBG from '../../Images/ToDoBg.jpg';

const STORAGE_KEY = "@toDos";

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

export default function Todo() {
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const onChangeText = (payload) => setText(payload);
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

  const today = new Date();
  const month = today.getMonth();
  const date = today.getDate();

  const handleCheck = (key) => {
    if(toDos[key].checked === false) {
      toDos[key] = { ...toDos[key], checked: true };
    } else{
      toDos[key] = { ...toDos[key], checked: false };
    }
    const newToDos = { ...toDos, [key]: toDos[key] };
    setToDos(newToDos);
    saveToDos(newToDos);
  };


  const saveToDos = async(toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadToDos = async() => {
     try{
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if(s){
        setToDos(JSON.parse(s));
      }
    }
    catch(e){
      Alert.alert("Error", "Todo Function is not loaded");
      console.log(e);
    }
  };


  
  useEffect(() => { 
    loadToDos();
  }, []);

  const addToDo = async() => {
    if(text === ""){
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: {text, checked: false},
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  const deleteToDo = (key) => {
    if(Platform.OS === "web"){
      const ok = confirm("Do you want to delete this To-Do?");
      if(ok){
        const newToDos = { ...toDos };
        delete newToDos[key];
        setToDos(newToDos);
        saveToDos(newToDos);
      }
    } else{
      Alert.alert(
        "Delete", 
        "Are you sure?", [
        { text: "Cancel", style: "destructive" },
        {
          text: "Yes",
          onPress: () => {
            const newToDos = { ...toDos };
            delete newToDos[key];
            setToDos(newToDos);
            saveToDos(newToDos);
          },
        },
      ]);
    }
        
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ImageBackground source={IMGBG} style={styles.image}>
      <View style={styles.date}>
        <Text style={styles.dateText}>{mon[month]} {date}</Text>
      </View>
      
      <View style={styles.toDoBox}>
        <TextInput 
        onSubmitEditing={addToDo}
        returnKeyType="done"
        onChangeText={onChangeText}
        value={text}
        placeholder={"Add a To Do"} 
        style={{ //addToDo
          width : webWidth >= 910 ? 900: webWidth - 10,
          backgroundColor: toDoTheme.addToDoBox,
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderRadius: 15,
          marginVertical: 5,
          fontSize: 18,
        }} 
          />
        
        <ScrollView>
          {Object.keys(toDos).map((key) => 
            <View key={key} style={{ //toDo
              width: webWidth >= 910 ? 900: webWidth - 10,
              backgroundColor: toDoTheme.toDoBg,
              marginVertical: 5,
              paddingVertical: 20,
              paddingHorizontal: 15,
              borderRadius: 15,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <BouncyCheckbox 
                isChecked={toDos[key].checked} 
                onPress={() => handleCheck(key)}
                size={20}
                text={toDos[key].text}
                textStyle={{ color: "black" }}
                iconStyle={{ borderColor: "black" }}
                fillColor="black"
              />
              <View style={styles.icons}>
                <TouchableOpacity
                  onPress={() => deleteToDo(key)}
                  hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} >
                  <Feather name="delete" size={20} color={toDoTheme.deleteIcon} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
    </View>
    </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
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
  toDoBox: {
    flex: 9.5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  toDoText: {
    fontSize: 15,
    fontWeight: "500",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
