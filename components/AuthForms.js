import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, setCurrentUser } from '../features/usersSlice';

import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { resetFavorite } from "../features/hotelsSlice";
import { setUsersFavorite } from "../features/hotelsSlice";

export default function AuthForms(props) {
  const [loader, setLoader] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [userData, setUserData] = useState({ name: '', password: '' });
  const users = useSelector(state => state.users.value);

  const dispatch = useDispatch();

  const registration = () => {
    if(userData.name === '' || userData.password === '') return;

    const user = {
      id: new Date().getTime(),
      favorites: [],
      ...userData,
    }

    dispatch(addUser(user));
    setToggle(!toggle);
    setUserData({ name: '', password: '' });
  }

  const authorization = () => {
    const user = users.find(item => item.name === userData.name.trim() && item.password === userData.password);

    if(user) {
      dispatch(setCurrentUser(user));
      dispatch(resetFavorite());
      dispatch(setUsersFavorite(user));
      setUserData({ name: '', password: '' });
      setLoader(true);

      setTimeout(() => {
        setLoader(false);
        props.navigation.navigate('Hotels List');
      }, 1500)
    }
  }

  const toggleForms = () => {
    setToggle(!toggle);
    setUserData({ name: '', password: '' });
  }

  return (
    <>
      <View style={{ position: 'relative' }}>
        {
          loader &&
          <View style={styles.loader}>
            <ActivityIndicator size='large' color='#006ce4' />
          </View>
        }

        <View style={styles.container}>  
          <Text style={styles.header}>{ toggle ? 'Регистрация' : 'Авторизация' }</Text>

          <TextInput 
            name='name' 
            value={userData.name} 
            style={styles.input} 
            placeholder="Ваше имя"
            onChangeText={(text) => setUserData({ ...userData, name: text })} 
          ></TextInput>

          <TextInput 
            name='password' 
            value={userData.password} 
            style={styles.input} 
            placeholder="Пароль"
            onChangeText={(text) => setUserData({ ...userData, password: text })} 
          ></TextInput>

          <TouchableOpacity style={styles.button} onPress={toggle ? registration : authorization}>
            <Text style={styles.buttonText}>{toggle ? 'Зарегистрироваться' : 'Войти'}</Text>
          </TouchableOpacity>

          <View style={styles.formsToggle}>
            <Text style={styles.formsToggleText}>{ toggle ? 'Уже есть аккаунт?' : 'Нет аккаунта?' }</Text>
            <TouchableOpacity onPress={toggleForms}>
              <Text style={styles.formsToggleButton}>{ toggle ? 'Авторизоваться' : 'Зарегистрироваться' }</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    gap: 30,
    justifyContent: 'center',
  },

  loader: {
    width: '100%',
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    zIndex: 998,
    justifyContent: 'center',
    backgroundColor: '#d3d3d3cc',
  },

  header: {
    textAlign: 'center',
    fontSize: 24,
    marginTop: 20,
  },

  input: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#ffb700',
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },

  button: {
    borderRadius: 5,
    padding: 20,
    backgroundColor: '#006ce4',
  },

  buttonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
  },

  formsToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    padding: 20,
  },

  formsToggleText: {
    textAlign: 'center',
  },

  formsToggleButton: {
    textDecorationLine: 'underline'
  },  
})