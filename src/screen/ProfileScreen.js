import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomHeader from "../component/CustomHeader";
import EditFieldModal from "../component/EditFieldModal";
import ProfileDetaitem from "../component/ProfileDetaitem";
import SelectImage from "../component/SelectImage";
import Store from "../Store/Store";
import CommanStyle from "../theme/CommanStyle";
import Images from "../theme/Images";
import getUserInfo from "../utils/GetUserInfo";
import CameraPermission from "../utils/CameraPermission";

const ProfileScreen = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [about, setAbout] = useState("");
  const setIsLoaderVisible = Store((state) => state.setIsLoaderVisible);
  const setToastData = Store((state) => state.setToastData);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const setBottomTabZindex = Store((state) => state.setBottomTabZindex);
  const [editInput, setEditInput] = useState("");
  const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);
  const [editDetail, setEditDetail] = useState({
    lable: "",
    placeholder: "",
  });

  useEffect(() => {
    // setIsLoaderVisible(true);
    const getCurrentUser = async () => {
      const user = await getUserInfo();
      setCurrentUser(user);
      // setTimeout(() => {
      //   setIsLoaderVisible(false);
      // }, 1000);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("users")
      .doc(currentUser.userId)
      .onSnapshot((snapshot) => {
        const userDoc = snapshot?.data();
        if (userDoc) {
          setProfileImage(userDoc?.profileImage ?? "");
          setUserData(userDoc);
          setName(userDoc?.name ?? "");
          setNickname(userDoc?.nickName ?? "");
          setPhoneNo(userDoc?.phoneNo ?? "");
          setAbout(userDoc?.about ?? "");
        }
      });

    return () => unsubscribe();
  }, [currentUser]);

  const onClickSetting = () => {
    navigation.navigate("SettingScreen");
  };

  const onClickCameraIcon = async () => {
    const isGranted = await CameraPermission();
    if (isGranted) {
      setIsCameraDialogOpen(true);
    } else {
      setToastData({
        type: 0,
        text1: "Please allow camera permission to access this feature",
        text2: "",
        iconType: "",
        isVisible: true,
      });
    }
  };

  const confirmImage = async (data) => {
    if (data?.data) {
      firestore()
        .collection("users")
        .doc(userData.userId)
        .update({
          profileImage: `data:${data?.mime};base64,${data?.data}`,
        })
        .then(() => {
          setToastData({
            type: 1,
            text1: "Profile image updated successfully",
            text2: "",
            iconType: "",
            isVisible: true,
          });
        })
        .catch((e) => {
          console.log(e, "==-=-=-=-");
          setToastData({
            type: 0,
            text1: e,
            text2: "",
            iconType: "",
            isVisible: true,
          });
        });
    } else {
      setToastData({
        type: 0,
        text1: "Image upload failed",
        text2: "",
        iconType: "",
        isVisible: true,
      });
      console.error("Image upload failed222:", error);
    }
  };

  const onClickEditBtn = (lable, placeholder, value) => {
    setEditDetail({
      lable: lable,
      placeholder: placeholder,
    });
    setEditInput(value);
    setIsOpenEditModal(true);
  };

  useEffect(() => {
    setBottomTabZindex(isOpenEditModal ? -1 : 0);
  }, [isOpenEditModal]);

  return (
    <View style={CommanStyle.container}>
      <CustomHeader
        showBack={false}
        leftView={() => {
          return <Text style={styles.headerTitle}>My Profile</Text>;
        }}
        rightView={() => {
          return (
            <TouchableOpacity onPress={onClickSetting} activeOpacity={0.9}>
              <Ionicons name="settings" size={24} color="white" />
            </TouchableOpacity>
          );
        }}
      />
      <ScrollView>
        <View>
          <SelectImage
            isSelectProfilePic={true}
            userImage={userData?.profileImage}
            placeHolder={Images.user}
            confirmImage={(data) => confirmImage(data)}
            onClose={() => setIsCameraDialogOpen(false)}
            onClickCameraIcon={() => onClickCameraIcon()}
            isCameraDialogOpen={isCameraDialogOpen}
          />
          <View style={styles.inputGroup}>
            <ProfileDetaitem
              icon={"person-outline"}
              lable={"Name"}
              value={name}
              onEdit={() => onClickEditBtn("Name", "Please enter a Name", name)}
              placeHolder={"Please enter a Name"}
            />
            <ProfileDetaitem
              icon={"alert-circle-outline"}
              lable={"About"}
              value={about}
              onEdit={() =>
                onClickEditBtn("About", "Please enter About text", about)
              }
              placeHolder={"Please enter About text"}
              numberOfLines={2}
            />
            <ProfileDetaitem
              icon={"happy-outline"}
              lable={"Nick Name"}
              value={nickname}
              onEdit={() =>
                onClickEditBtn("Nick Name", "Please enter Nickname", nickname)
              }
              placeHolder={"Please enter Nickname"}
            />
            <ProfileDetaitem
              icon={"mail-outline"}
              lable={"Mail"}
              value={userData?.email}
              onEdit={() =>
                onClickEditBtn("Mail", "Please enter Email", userData?.email)
              }
              placeHolder={"Please enter Email"}
              disabled={true}
            />
            <ProfileDetaitem
              icon={"call-outline"}
              lable={"Phone"}
              value={phoneNo}
              onEdit={() =>
                onClickEditBtn("Phone", "Please enter Phone number", phoneNo)
              }
              placeHolder={"Please enter Phone number"}
            />
          </View>
        </View>
      </ScrollView>
      {isOpenEditModal && (
        <EditFieldModal
          isVisible={isOpenEditModal}
          onClose={() => {
            setIsOpenEditModal(false), Keyboard.dismiss();
          }}
          value={editInput}
          onChangeText={setEditInput}
          lable={editDetail?.lable}
          placeholder={editDetail?.placeholder}
          userId={userData.userId}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    paddingHorizontal: 20,
    marginTop: 30,
    gap: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  nickname: {
    fontSize: 16,
    color: "#888",
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  phoneNo: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ProfileScreen;
