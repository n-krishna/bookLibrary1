import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../firebaseConfig";

export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch books when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchAvailableBooks();
    }, [])
  );

  const fetchAvailableBooks = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "books"), where("borrowed", "==", false));
      const querySnapshot = await getDocs(q);
      const bookList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      console.log("Fetched Available Books:", bookList);
      setBooks(bookList);
    } catch (error) {
      console.error("Error fetching available books:", error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Available Books</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading books...</Text>
      ) : books.length === 0 ? (
        <Text style={styles.noBooks}>No books available</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          numColumns={2}  // ✅ Displays books in 2 columns like a RecyclerView
          columnWrapperStyle={styles.row}  // ✅ Adds space between rows
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.bookItem} 
              onPress={() => navigation.navigate("BookDetail", { book: item })}
            >
              {item.coverImage && <Image source={{ uri: item.coverImage }} style={styles.bookImage} />}
              <Text style={styles.bookTitle}>{item.bookName}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  loadingText: { fontSize: 18, textAlign: 'center', marginTop: 20, color: 'blue' },
  noBooks: { fontSize: 18, textAlign: 'center', marginTop: 20, color: 'gray' },
  row: { 
    flex: 1, 
    justifyContent: "space-between", 
    marginBottom: 10 
  },  // ✅ Ensures even spacing between columns
  bookItem: { 
    flex: 1, 
    marginHorizontal: 5, 
    padding: 10, 
    backgroundColor: '#f8f8f8', 
    borderRadius: 5, 
    alignItems: "center" 
  },
  bookTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 5 
  },
  bookImage: {
    width: 120,  
    height: 180, 
    resizeMode: "cover",
    borderRadius: 5,
  },
});
