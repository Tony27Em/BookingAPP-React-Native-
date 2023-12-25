import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { saveFavorite } from "../features/usersSlice";
import { markFavorite, resetFiltered, searchFiltered } from "../features/hotelsSlice";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';

import { hotelsImage } from "../assets/images";

export default function HotelsList(props) {
  const [limit, setLimit] = useState(4);
  const [filter, setFilter] = useState({ address: '', price: '', rate: '' });
  const [hotels, setHotels] = useState([]);
  const allHotels = useSelector(state => state.hotels.value);
  const height = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  useEffect(() => {
    setHotels(allHotels.slice(0, limit));
  }, [limit, allHotels])

  const openHotelInfo = (id) => {
    props.navigation.navigate('About Hotel', id);
  }

  const doFilter = () => {
    dispatch(resetFiltered());
    dispatch(searchFiltered(filter));
    hideFilter();
  }

  const cancelFilter = () => {    
    dispatch(resetFiltered());
    setFilter({ address: '', price: 0, rate: 0 });
  }

  const toggleFilter = () => {
    Animated.timing(height, {
      toValue: height._value ? 0 : 1,
      duration: 100,
      useNativeDriver: false,
    }).start()   
  }

  const hideFilter = () => {
    if(height._value){      
      Animated.timing(height, {
        toValue: 0,
        duration: 50,
        useNativeDriver: false,
      }).start()
    }
  }

  const setFavorite = (item) => {
    dispatch(markFavorite(item.id));
    dispatch(saveFavorite(item));
  }
 
  return (
    <View style={styles.container}>
      <Animated.View style={{ 
        ...styles.filter, 
        zIndex: height.interpolate({
          inputRange: [0, 1], 
          outputRange:[0, 999]
        }),
      }}>

        <TouchableOpacity onPress={toggleFilter} style={styles.filterButton}>
          <Text style={styles.filterHeader}>Поиск по фильтру</Text>
          <FontAwesomeIcon icon={faFilter} style={{ color: '#ffffff' }} />
        </TouchableOpacity>

        <TouchableWithoutFeedback onPress={hideFilter}>
          <Animated.View style={{ 
            height: height.interpolate({
              inputRange: [0, 1],
              outputRange: [0, Dimensions.get('window').height]
            }), 
            backgroundColor: height.interpolate({
              inputRange: [0, 1],
              outputRange: ['transparent', '#d3d3d3cc']
            }),
            overflow: 'hidden',
          }}>
            <View style={styles.filterInputs}>
              <TextInput style={styles.filterInputsItem} value={filter.address} onChangeText={(text) => setFilter({...filter, address: text})} placeholder="Адрес"></TextInput>
              <TextInput style={styles.filterInputsItem} value={filter.price} onChangeText={(text) => setFilter({...filter, price: text})} placeholder="Стоимость от..." keyboardType="numeric"></TextInput>
              <TextInput style={styles.filterInputsItem} value={filter.rate} onChangeText={(text) => setFilter({...filter, rate: text})} placeholder="Рейтинг свыше..." keyboardType="numeric"></TextInput>

              <View style={styles.filterOptionButtons}>
                <TouchableOpacity style={styles.filterOptionButtonItem} onPress={doFilter}>
                  <Text style={{ textAlign: 'center', color: '#ffffff' }}>Поиск</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOptionButtonItem} onPress={cancelFilter}>
                  <Text style={{ textAlign: 'center', color: '#ffffff' }}>Сброс</Text>
                </TouchableOpacity>            
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>

      <FlatList 
        data={hotels}
        keyExtractor={(_, index) => index}
        style={styles.list}
        onEndReached={() => setLimit(prev => prev + 4)}
        ListHeaderComponent={() => <Text style={styles.listHeader}>Список доступных отелей</Text>}
        renderItem={({item}) => (
          !item.wasFiltered &&
          <View style={{ position: 'relative' }}>
            <TouchableOpacity style={{ position: 'absolute', top: 25, right: 25, zIndex: 1 }} onPress={() => setFavorite(item)}>
              <FontAwesomeIcon icon={faHeart} style={{ color: item.isFavorite ? 'red' : '#ffffff' }} size={30}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.listItem} onPress={() => openHotelInfo(item.id)}>
              <Image source={hotelsImage[item.img]} style={{ width: '100%', borderRadius: 5 }}></Image>
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    position: 'relative',
  },

  filter: {
    width: '100%',
    position: 'absolute',
    top: 0,
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 10,
    backgroundColor: '#006ce4',
  },

  filterHeader: { 
    fontSize: 16,
    color: '#ffffff',
  },

  filterInputs: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },

  filterInputsItem: {
    width: '95%',
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#ffb700',
  },

  filterOptionButtons: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },

  filterOptionButtonItem: {
    flex: 0.5,
    borderRadius: 5,
    paddingVertical: 5,
    backgroundColor: '#006ce4',
  },

  list: {
    marginTop: 50,
  },

  listHeader: {
    textAlign: 'center',
    fontSize: 20,
  },

  listItem: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ffb700',
    marginHorizontal: 10,
    marginVertical: 10
  },  
})