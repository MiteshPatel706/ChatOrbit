import moment from "moment";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomHeader from "../component/CustomHeader";
import LazyImageLoading from "../component/LazyImageLoading";
import Store from "../Store/Store";
import Colors from "../theme/Color";
import Images from "../theme/Images";

const MediaDetailscreen = ({ navigation, route }) => {
  const { data, title, type } = route.params;
  const setCommingSoonData = Store((state) => state.setCommingSoonData);

  const HeaderLeftView = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ height: 20, width: 20 }}
            resizeMode="contain"
            source={Images.back}
            tintColor={Colors.black}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title ?? ""}
          </Text>
          <Text style={styles.headerTimeText} numberOfLines={1}>
            {moment(data?.createdAt).format("DD MMMM, h:mm a")}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() =>
              setCommingSoonData({
                isVisible: true,
                title: "More options",
                description: "Comming soon...",
              })
            }
          >
            <Ionicons name="ellipsis-vertical" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.styles}>
      <View style={styles.headerContainer}>
        <CustomHeader
          container={styles.headerSubContainer}
          showBack={false}
          leftView={HeaderLeftView}
        />
      </View>
      <LazyImageLoading
        source={{ uri: data?.imageURL }}
        style={{ height: "100%", width: "100%" }}
      />
      <View style={styles.footerContainer}>
        {data?.text && (
          <Text
            style={[
              styles.headerTimeText,
              { fontSize: 13, marginBottom: 20, marginHorizontal: 10 },
            ]}
            numberOfLines={6}
          >
            {data?.text}
          </Text>
        )}
        <TouchableOpacity
          style={styles.replayContainer}
          onPress={() =>
            setCommingSoonData({
              isVisible: true,
              title: "Replay",
              description: "Comming soon...",
            })
          }
          activeOpacity={0.9}
        >
          <Image
            source={Images.leftReply}
            style={{ height: 15, width: 15 }}
            tintColor={Colors.green}
          />
          <Text
            style={[styles.headerTitle, { fontSize: 14 }]}
            numberOfLines={1}
          >
            Replay
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MediaDetailscreen;

const styles = StyleSheet.create({
  replayContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-end",
    backgroundColor: Colors.white,
    height: 35,
    width: 85,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  footerContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    backgroundColor: Colors.white + "20",
    padding: 10,
  },
  headerSubContainer: {
    backgroundColor: Colors.white + "20",
    paddingHorizontal: 10,
  },
  headerContainer: {
    position: "absolute",
    width: "100%",
    top: 0,
    zIndex: 1,
  },
  headerTimeText: {
    color: Colors.black,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 15,
  },
  headerTitle: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: "600",
  },
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
});
