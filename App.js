
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import React, { useState, useEffect } from 'react';


import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQVCVwDAAnAxhWFoNY2NEBy9hQp1lCpho",
  authDomain: "test-ff763.firebaseapp.com",
  projectId: "test-ff763",
  storageBucket: "test-ff763.appspot.com",
  messagingSenderId: "277292797421",
  appId: "1:277292797421:web:d4a8e18c812ccc017d2be4",
  measurementId: "G-4BP49KHGCN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


export default function App() {
  // State to hold shopping lists
  const [lists, setLists] = useState([]);
  // User uid for authentication
  const [uid, setUid] = useState();
  // Logged in Text to display user if they're logged in or currently being authenticated
  const [loggedInText, setLoggedInText] = useState("Please wait. Your're being authenticated.");

  // Create reference to the shopping list collection on firestore
  const shoppingListRef = collection(db, 'shoppinglist');

  const addList = () => {
    addDoc(shoppingListRef, {
      name: 'TestList',
      items: ['eggs', 'pasta', 'veggies'],
      uid: uid,
    });
  }

  const onCollectionUpdate = (querySnapshot) => {
    const lists = [];
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      lists.push({
        name: data.name,
        items: data.items.toString(),
      });
    });
    setLists(lists);
  }


  useEffect(() => {
    const auth = getAuth();

    const authUnsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await signInAnonymously(auth);
      }

      // Set states for user uid and logged in text
      setUid(user.uid);
      setLoggedInText('Hello there!');

      // Create a query to get the shopping list belonging to the user
      const userListQuery = query(shoppingListRef, where("uid", "==", uid));
      unsubscribe = onSnapshot(userListQuery, onCollectionUpdate);

    });

    return () => {
      authUnsubscribe();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text>{loggedInText}</Text>
      <Text style={styles.text}>All Shopping Lists</Text>
      <FlatList
        data={lists}
        renderItem={({ item }) =>
          <Text style={styles.item}>{item.name}: {item.items}</Text>}
      />
      <Button onPress={addList} title='Add static list' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
  },
  item: {
    fontSize: 20,
    color: 'blue',
  },
  text: {
    fontSize: 30,
  }
});
