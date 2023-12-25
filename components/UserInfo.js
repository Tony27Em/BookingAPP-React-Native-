import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { markFavorite } from "../features/hotelsSlice";
import { deleteFavorite, setChangeUserData } from "../features/usersSlice";

import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { hotelsImage } from "../assets/images";

export default function UserInfo(props) {
  const [disabled, setDisabled] = useState(false);
  const [userData, setUserData] = useState({ name: '', password: '' });
  const currentUser = useSelector(state => state.users.currentUser);
  const { id, name, password, favorites } = currentUser;
  const dispatch = useDispatch();

  useEffect(() => {    
    setUserData({ name, password });
  }, [currentUser])

  const changeUserData = () => {
    dispatch(setChangeUserData({ id, ...userData }));
    setDisabled(false);
  }

  const changeFavorites = (id) => {
    dispatch(markFavorite(id));
    dispatch(deleteFavorite(id));
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ margin: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>ID: {id}</Text>
          <Text>Имя: {name}</Text>
        </View>

        <TextInput 
          value={userData.name} 
          editable={disabled} 
          onChangeText={(text) => setUserData({...userData, name: text})} 
          style={{...styles.input, borderColor: disabled ? '#ffb700' : 'lightgray'}} 
          placeholder="Ваше имя"
        ></TextInput>
        <TextInput 
          value={userData.password} 
          editable={disabled} 
          onChangeText={(text) => setUserData({...userData, password: text})} 
          style={{...styles.input, borderColor: disabled ? '#ffb700' : 'lightgray'}} 
          placeholder="Пароль"
        ></TextInput>
        <View style={{ flexDirection: 'row', gap: 5 }}>
          <TouchableOpacity style={{...styles.optionButton, backgroundColor: disabled ? '#006ce4' : 'lightgray'}} onPress={() => changeUserData()}>
            <Text style={{ textAlign: 'center', color: '#ffffff' }}>Сохранить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => setDisabled(true)}>
            <Text style={{ textAlign: 'center', color: '#ffffff' }}>Редактировать</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginBottom: 90 }}>
        <FlatList 
          data={favorites}
          keyExtractor={(_, index) => index}
          style={{ marginTop: 20, marginBottom: 100 }}
          ListHeaderComponent={() => <Text style={{ fontSize: 20, fontWeight: 700, textAlign: 'center' }}>Избранное</Text>}
          renderItem={({item}) => (
            <View style={{ position: 'relative' }}>
              <TouchableOpacity style={{ position: 'absolute', top: 25, right: 25, zIndex: 1 }} onPress={() => changeFavorites(item.id)}>
                <FontAwesomeIcon icon={faHeart} style={{ color: item.isFavorite ? 'red' : '#ffffff' }} size={30}/>
              </TouchableOpacity>

              <TouchableOpacity 
                style={{ borderWidth: 1, borderRadius: 5, borderColor: '#ffb700', marginVertical: 10, marginHorizontal: 10 }}
                onPress={() => props.navigation.navigate('About Hotel', item.id)}
              >
                <Image source={hotelsImage[item.img]} style={{ width: '100%' }}></Image>
                <View style={{ padding: 10, gap: 5 }}>
                  <Text style={{ fontSize: 20 }}>{item.name}</Text>
                  <Text>Расположен по адресу: {item.address}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text>Рейтинг {item.rate}/10</Text>
                    <Text>Цена от {item.price} у.е.</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />             
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10
  },

  optionButton: {
    flex: 0.5,
    borderRadius: 5,
    paddingVertical: 5,
    backgroundColor: '#006ce4',
  }
})