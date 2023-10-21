import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet,StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
 

// Function to fetch user data
async function getUser() {
  try {
    const response = await axios.get('https://api.github.com/users');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}


// Define static user data
const registeredUsers = [
  { email: "m@gmail.com", password: "12345" },
  // Add more registered users as needed
];

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Check if the entered email and password match any registered user
    const user = registeredUsers.find(user => user.email === email && user.password === password);

    if (user) {
      navigation.navigate('TodoApp');
    } else {
      alert('Invalid credentials');
    }
  };
  return (
    <View style={loginStyles.container}>
      <StatusBar hidden />
      <View style={styles.content}>
        <Text style={styles.headerText}>Log In</Text>
        <View style={loginStyles.inputContainer}>
          <View style={loginStyles.inputWrapper}>
            <TextInput
              style={loginStyles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
            />
          </View>
          <View style={loginStyles.inputWrapper}>
            <TextInput
              style={loginStyles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signUpLink}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleSignUp = async () => {
    if (password === repeatPassword) {
      try {
        const response = await axios.post('https://api.github.com/users/', {
          email,
          password,
        });
        console.log(response.data.message);
        staticUser.email = email;
        staticUser.password = password;
        alert('User created!');
        navigation.navigate('Login');
      } catch (error) {
        console.log("there is a problem here ")
        console.error(error);
      }
    } else {
      alert('Passwords do not match');
    }
  };

  return (
    <View style={signUpStyles.container}>
      <StatusBar hidden />
      <View style={styles.content}>
        <Text style={styles.headerText}>Create an account</Text>
        <View style={signUpStyles.inputContainer}>
          <View style={signUpStyles.inputWrapper}>
            <TextInput
              style={signUpStyles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
            />
          </View>
          <View style={signUpStyles.inputWrapper}>
            <TextInput
              style={signUpStyles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View style={signUpStyles.inputWrapper}>
            <TextInput
              style={signUpStyles.input}
              placeholder="Repeat Password"
              secureTextEntry
              value={repeatPassword}
              onChangeText={(text) => setRepeatPassword(text)}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signUpLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.signUpText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const TodoApp = () => {
  // State variables
  const [userData, setUserData] = useState(null);
  const [days, setDays] = useState([
    { id: 1, name: 'Today', tasks: [{ id: 1, name: 'Graduation Project', completed: false },{ id: 2, name: 'Training', completed: false }] },
    { id: 2, name: 'Tomorrow', tasks: [{ id: 1, name: 'Exam(2:00)', completed: false },{ id: 2, name: 'Session(7:00)', completed: false }] },
  ]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [newDay, setNewDay] = useState('');
  const [newTask, setNewTask] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    getUser().then(fetchedUserData => {
      setUserData(fetchedUserData);
    });
  }, []);

  // Event handler to add a new day
  const handleAddDay = () => {
    if (newDay.trim() !== '') {
      setDays(prevDays => [
        ...prevDays,
        { id: Date.now(), name: newDay.trim(), tasks: [] },
      ]);
      setNewDay('');
    }
  };

  // Event handler to add a new task
  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      setDays(prevDays =>
        prevDays.map(day =>
          day.id === selectedDay
            ? { ...day, tasks: [...day.tasks, { id: Date.now(), name: newTask.trim(), completed: false }] }
            : day)
      );
      setNewTask('');
    }
  };

  const handleTaskCompletion = taskId => {
    setDays(prevDays =>
      prevDays.map(day => ({
        ...day,
        tasks: day.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      }))
    );
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.sidebar}>
        <View style={styles.userInfoContainer}>
          {userData && (
            <>
              <Image source={{ uri: userData[0].avatar_url }} style={styles.userImage} />
              <Text></Text>
            </>
          )}
        </View>
  
        <Text style={styles.sidebarHeader}>Days</Text>
        {days.map(day => (
          <TouchableOpacity
            key={day.id}
            style={selectedDay === day.id ? styles.sidebarItemActive : styles.sidebarItem}
            onPress={() => setSelectedDay(day.id)}
          >
            <Text style={styles.sidebarText}>{day.name}</Text>
          </TouchableOpacity>
        ))}
        <TextInput
          style={styles.input}
          placeholder="New Day"
          value={newDay}
          onChangeText={setNewDay}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddDay}>
          <FontAwesome name="plus" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
  
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Image source={require('./tasks-icon-9.png')} style={styles.image} />
          </View>
        </View>
  
        {/* Task List */}
        <ScrollView style={styles.taskList}>
          {days.find(day => day.id === selectedDay)?.tasks.map(task => (
            <TouchableOpacity
              key={task.id}
              style={[styles.taskItem, { backgroundColor: 'white' }]}
              onPress={() => handleTaskCompletion(task.id)}
            >
              <FontAwesome
                name={task.completed ? 'check-circle' : 'circle-thin'}
                size={20}
                color="black"
              />
              <Text
                style={[
                  styles.taskText,
                  {
                    textDecorationLine: task.completed ? 'line-through' : 'none',
                  },
                ]}
              >
                {task.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
  
        {/* Input Container */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Task"
            value={newTask}
            onChangeText={setNewTask}
            maxLength={50}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTask}
            accessibilityLabel="Add Task"
          >
            <FontAwesome name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
  
};

const Stack = createNativeStackNavigator();

const App = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getUser().then(fetchedUserData => {
      setUserData(fetchedUserData);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TodoApp" component={TodoApp} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


const loginStyles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    padding: 2,
    marginTop: 50, // Adjusted marginTop for better placement
    width: 330,
    marginLeft: 15,
    marginTop:200,
    borderRadius: 3, // Adding rounded corners for a nicer look
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    flexDirection: 'column', // Stack inputs vertically
  },
  inputWrapper: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  signUpLink: {
    marginTop: 20,
  },
  signUpText: {
    color: 'blue',
    fontSize: 16,
  },
});

const signUpStyles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    padding: 2,
    marginTop: 50, // Adjusted marginTop for better placement
    width: 330,
    marginLeft: 15,
    marginTop:200,
    borderRadius: 3, // Adding rounded corners for a nicer look
  },
    headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    flexDirection: 'column', // Stack inputs vertically
  },
  inputWrapper: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  signUpLink: {
    marginTop: 20,
  },
  signUpText: {
    color: 'green',
    fontSize: 16,
  },
});

 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  statusBar: {
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRightWidth:2,
    borderColor:'white',

  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginRight: 10,
    marginTop:30,
    alignSelf: 'center',
    },
  userdata: {
    fontSize: 17,
    color: 'white',
    textAlign: 'center',
  },
  sidebar: {
    backgroundColor: 'black',
    width: 5,
    paddingTop: 30,
  },

  sidebarItem: {
    paddingVertical: 5,
    marginBottom: 5,
    backgroundColor: 'transparent',
  },
  sidebarItemActive: {
    backgroundColor: 'gray',
    paddingVertical: 8,
    borderRadius: 30,
    marginBottom: 8,
  },
  sidebarText: {
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
  },
  content: {
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 40,
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  taskText: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    marginLeft: 8,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 10,
    color: '#333',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;