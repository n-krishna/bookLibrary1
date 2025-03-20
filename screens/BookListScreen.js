import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../firebaseConfig";

export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
      setFilteredBooks(bookList);
    } catch (error) {
      console.error("Error fetching available books:", error);
    }
    setLoading(false);
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text.trim() === "") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book => 
        book.bookName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Available Books</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search books..."
        value={searchTerm}
        onChangeText={handleSearch}
      />

      {loading ? (
        <Text style={styles.loadingText}>Loading books...</Text>
      ) : filteredBooks.length === 0 ? (
        <Text style={styles.noBooks}>No books available</Text>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          numColumns={2}  
          columnWrapperStyle={styles.row}  
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
  searchInput: { 
    height: 40, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 5, 
    paddingHorizontal: 10, 
    marginBottom: 10 
  },
  loadingText: { fontSize: 18, textAlign: 'center', marginTop: 20, color: 'blue' },
  noBooks: { fontSize: 18, textAlign: 'center', marginTop: 20, color: 'gray' },
  row: { 
    flex: 1, 
    justifyContent: "space-between", 
    marginBottom: 10 
  },  
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

