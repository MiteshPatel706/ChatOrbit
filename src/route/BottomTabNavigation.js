import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Broadcasts from '../screen/Broadcasts';
import CallHistoryScreen from '../screen/CallHistoryScreen';
import HomeScreen from '../screen/HomeScreen';
import ProfileScreen from '../screen/ProfileScreen';
import Colors from '../theme/Color';
import Images from '../theme/Images';
import Store from '../Store/Store';
import LottieView from 'lottie-react-native';
import Lotties from '../theme/Lotties';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        headerShown: false,
        tabBarStyle: {},
        lazy: true,
      })}
      backBehavior="history"
      tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Broadcasts" component={Broadcasts} />
      <Tab.Screen name="CallHistoryScreen" component={CallHistoryScreen} />
      <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;

function MyTabBar({state, navigation}) {
  const bottomTabZindex = Store(state => state.bottomTabZindex);

  const insets = useSafeAreaInsets();
  const ITEM_TITLES = ['Home', 'Broadcasts', 'Calls', 'Profile'];
  const SELECTED_IMAGES = [
    Images.house,
    Images.reel,
    Images.callLlog,
    Images.user,
  ];

  const Seleted_Lotties_Animation = [
    Lotties.homeTabAnimationGreen,
    Lotties.reelGreen,
    Lotties.callHistoryGreen,
    Lotties.personGreen,
  ];

  const UnSeleted_Lotties_Animation = [
    Lotties.homeTabAnimationGrey,
    Lotties.reelGrey,
    Lotties.callHistoryGrey,
    Lotties.personGrey,
  ];

  const animationHeightWidth = [
    {height: 60, width: 60},
    {height: 44, width: 44},
    {height: 40, width: 40},
    {height: 34, width: 34},
  ];

  const UnSeleted_Autoplay_Animation = [false, false, false, true];

  return (
    <View
      style={[
        styles.commonTabBarStyle,
        {
          height: 60,
          marginBottom:
            insets.bottom != 0
              ? Platform.OS == 'ios'
                ? insets.bottom - 10
                : insets.bottom
              : 10,
          zIndex: bottomTabZindex,
        },
      ]}>
      <View style={styles.iconContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({
                name: route.name,
                merge: true,
                params: {isTabPressed: true},
              });
            }
          };

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              key={route.name}
              onPress={onPress}
              style={styles.tabItemsTouchable}>
              <View style={styles.rightIconButton}>
                {isFocused ? (
                  <LottieView
                    source={Seleted_Lotties_Animation[index]}
                    autoPlay
                    loop
                    style={{
                      height: animationHeightWidth[index].height,
                      width: animationHeightWidth[index].width,
                    }}
                  />
                ) : (
                  <LottieView
                    source={UnSeleted_Lotties_Animation[index]}
                    autoPlay={true}
                    loop={false}
                    style={{
                      height: animationHeightWidth[index].height,
                      width: animationHeightWidth[index].width,
                    }}
                    speed={2}
                  />
                )}

                {/* <Image
                  source={SELECTED_IMAGES[index]}
                  tintColor={isFocused ? Colors.green : Colors.grey_575e64}
                  style={{height: 22, width: 22}}
                /> */}
              </View>
              <Text
                style={[
                  styles.title,
                  {color: isFocused ? Colors.green : Colors.grey_575e64},
                ]}>
                {ITEM_TITLES[index]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  gradientText: {
    fontSize: 12,
    lineHeight: 14,
  },
  tabTitleNormal: {
    fontSize: 12,
    color: 'grey',
    lineHeight: 14,
  },
  tabTitleSelected: {
    color: Colors.green,
  },

  rightIcon: {
    width: 22,
    height: 22,
  },
  rightIconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 30,
  },

  iconContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  tabItemsTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    // marginTop: 2,
  },

  commonTabBarStyle: {
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 10,
    width: '95%',
    alignSelf: 'center',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Android shadow
    elevation: 10,
    borderRadius: 100,
    borderWidth: 0.2,
    borderColor: '#00000020',
    zIndex: 0,
  },

  iconImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
