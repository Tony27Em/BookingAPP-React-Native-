import store from './app/store';
import { Provider } from 'react-redux';
import { TouchableOpacity } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthForms from './components/AuthForms';
import HotelsList from './components/HotelsList';
import HotelInfo from './components/HotelInfo';
import UserInfo from './components/UserInfo';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons/faCircleUser';

const Stack = createNativeStackNavigator();

const components = [
  { name: 'Forms', component: AuthForms },
  { name: 'Hotels List', component: HotelsList },  
  { name: 'About Hotel', component: HotelInfo },
  { name: 'About User', component: UserInfo },
]

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          {
            components.map(({ name, component }) => (
              <Stack.Screen options={({ navigation }) => ({ 
                title: 'Bookeng.com',
                headerStyle: { backgroundColor: '#003c95' },
                headerTintColor: '#ffffff',
                headerTitleAlign: 'center',                
                headerRight: () => {
                  if(name === 'Hotels List') {
                    return (
                      <TouchableOpacity onPress={() => navigation.navigate('About User')}>
                        <FontAwesomeIcon icon={faCircleUser} size={24} style={{ color: '#ffffff' }}/>
                      </TouchableOpacity>
                    )
                  }
                }
              })} 
                key={name} 
                name={name} 
                component={component}
              /> 
            ))
          }
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}