import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { saveFavorite } from "../features/usersSlice";
import { addReview, markFavorite } from "../features/hotelsSlice";

import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { hotelsImage } from "../assets/images";

export default function HotelInfo(props) {
  const [review, setReview] = useState('');
  const currentUser = useSelector(state => state.users.currentUser);
  const selectedHotel = useSelector(state => state.hotels.value.find(item => item.id === props.route.params))
  const { id, name, address, price, rate, img, isFavorite, reviews, description } = selectedHotel
  const dispatch = useDispatch();

  const addNewReview = (id) => {
    dispatch(addReview({ id, review, username: currentUser.name }));
    setReview('');
  }

  const setFavorite = (id) => {
    dispatch(markFavorite(id));
    dispatch(saveFavorite(selectedHotel));
  } 

  return (
    <ScrollView styl={{ flex: 1 }}>
      <View style={{ position: 'relative', gap: 20 }}>
        <TouchableOpacity style={{ position: 'absolute', top: 25, right: 25, zIndex: 1 }} onPress={() => setFavorite(id)}>
          <FontAwesomeIcon icon={faHeart} style={{ color: isFavorite ? 'red' : '#ffffff' }} size={30}/>
        </TouchableOpacity>

        <View>
          <Image source={hotelsImage[img]} style={{ width: '100%' }}></Image>
          <View style={{ padding: 10, gap: 5 }}>
            <Text style={{ fontSize: 20 }}>{name}</Text>
            <Text>Расположен по адресу: {address}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text>Рейтинг {rate}/10</Text>
              <Text>Цена от {price} у.е.</Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: 700, marginTop: 20 }}>Описание:</Text>
            <Text style={{ textAlign: 'justify' }}>Описание: {description}</Text>
          </View>
        </View>

        <View style={{ padding: 10, gap: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 700, textAlign: 'center' }}>Отзывы</Text>
          {
            reviews.map((item, index) => (
              <View key={index} style={{ borderWidth: 1, borderRadius: 5, borderColor: '#006ce4', gap: 5, padding: 10 }}>
                <Text>Пользователь: {item.username}</Text>
                <Text>{item.review}</Text>
                <Text>Дата добавления: {item.date}</Text>
              </View>
            ))
          }
        </View>

        <View style={{ padding: 10, gap: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 700, textAlign: 'center' }}>Оставить отзыв</Text>
          <TextInput value={review} onChangeText={setReview} style={{ borderWidth: 1, borderRadius: 5, borderColor: '#ffb700', padding: 10 }}></TextInput>
          <TouchableOpacity 
            style={{ width: '75%', alignSelf: 'center', backgroundColor: '#006ce4', paddingVertical: 10, borderRadius: 10 }}
            onPress={() => addNewReview(id)}>
            <Text style={{ color: '#ffffff', textAlign: 'center' }}>Добавить</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={{ width: '75%', alignSelf: 'center', backgroundColor: '#006ce4', paddingVertical: 10, borderRadius: 10, marginVertical: 20 }}
          onPress={() => props.navigation.navigate('Hotels List')}
        >
          <Text style={{ color: '#ffffff', textAlign: 'center' }}>Вернуться к списку</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

// Скопипастил часть кода с общего списка отелей, хотя надо было в отдельный компонент вынести
// textAlign: 'justify' не работает на некоторых версиях Android