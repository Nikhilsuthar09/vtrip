import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  StyleSheet,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Configs/firebaseConfig";
import { useNavigation } from "expo-router";
import {
  handleFirebaseAuthErrors,
  handleSignupValidation,
} from "../utils/AuthHandlers";
import { useAuth } from "../Context/AuthContext";
import { Image } from "expo-image";
import AirplaneLoading from "../components/AirplaneLoading";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setRegistrationState } = useAuth();
  const navigation = useNavigation();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  if (loading) {
    return <AirplaneLoading/>;
  }
  const resetData = () => {
    setEmail("")
    setPassword("")
    setName("")
  }
  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  const signup = async () => {
    Keyboard.dismiss();
    // input validation
    if (!handleSignupValidation(email, password, name)) {
      return;
    }
    let userCreated = false
    let user = null;
    try {
      setLoading(true);
      setRegistrationState(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Signed in
      user = userCredential.user;
      userCreated = true;
      const nameToSave = toTitleCase(name);
      await updateProfile(user, {
        displayName: nameToSave,
      });
      await signOut(auth);
      resetData()
      setRegistrationState(false);
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      if(userCreated && user){
        try{
          await user.delete()
        }
        catch(e){
          console.log("failed to clean up user account");
        }
      }
      const errorMessage = handleFirebaseAuthErrors(error);
      console.log(errorMessage);
      Alert.alert("Error ", errorMessage);
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        style={styles.imageRectangle}
        source={require("../../assets/img/rectangle.png")}
      />
      <Image
        style={styles.imageEclipse}
        source={require("../../assets/img/eclipse.png")}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%" }}
        keyboardVerticalOffset={1}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.signupContainer}>
            <Pressable onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={24} color={COLOR.textPrimary} />
            </Pressable>
            <View style={styles.signupTitle}>
              <Text style={styles.signupText}>Sign up </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.signupLinkText}>
                  Already have an account?{" "}
                </Text>
                <Pressable onPress={() => navigation.goBack()}>
                  <Text
                    style={{
                      color: COLOR.primary,
                      fontFamily: FONTS.semiBold,
                      fontSize: FONT_SIZE.caption,
                    }}
                  >
                    Login
                  </Text>
                </Pressable>
              </View>
            </View>
            <View>
              <View>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  placeholder="eg John Doe"
                  placeholderTextColor={COLOR.placeholder}
                  style={styles.input}
                  value={name}
                  onChangeText={(value) => setName(value)}
                />
              </View>
              <View>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="name@email.com"
                  placeholderTextColor={COLOR.placeholder}
                  onChangeText={(value) => setEmail(value)}
                  value={email}
                  autoCorrect={false}
                />
              </View>
              <View>
                <Text style={styles.label}>Set Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Create a Password"
                    placeholderTextColor={COLOR.placeholder}
                    onChangeText={(value) => setPassword(value)}
                    value={password}
                    secureTextEntry={!showPassword}
                    autoCorrect={false}
                    underlineColorAndroid="transparent"
                  />
                  <Pressable
                    onPress={togglePasswordVisibility}
                    style={styles.eyeIcon}
                  >
                    <AntDesign
                      name={showPassword ? "eye" : "eyeo"}
                      size={20}
                      color={COLOR.grey}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
            <Pressable onPress={signup}>
              <View style={styles.loginbuttonContainer}>
                <Text style={styles.loginbuttontext}>Register</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  signupContainer: {
    display: "flex",
    gap: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
  },
  signupTitle: {
    gap: 8,
  },
  imageRectangle: {
    position: "absolute",
    height: "40%",
    width: "100%",
  },
  imageEclipse: {
    position: "absolute",
    height: "30%",
    width: "60%",
  },
  signupText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.H1,
    color: COLOR.textPrimary,
  },
  signupLinkText: {
    fontFamily: FONTS.medium,
    color: COLOR.grey,
    fontSize: FONT_SIZE.caption,
  },
  loginbuttonContainer: {
    paddingHorizontal: 10,
    borderRadius: 10,
    paddingVertical: 16,
    backgroundColor: COLOR.primary,
    width: 275,
  },
  loginbuttontext: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.body,
    color: "#FFFFFF",
    textAlign: "center",
  },
  googleButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: COLOR.textSecondary,
    textAlign: "center",
  },
  input: {
    height: 46,
    width: 275,
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontFamily: FONTS.medium,
    color: COLOR.textSecondary,
    fontSize: FONT_SIZE.body,
  },
  passwordContainer: {
    position: "relative",
    width: 275,
  },
  passwordInput: {
    height: 46,
    width: "100%",
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingRight: 45,
    fontFamily: FONTS.medium,
    color: COLOR.textSecondary,
    fontSize: FONT_SIZE.body,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 13,
    padding: 2,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.caption,
    color: COLOR.grey,
    paddingTop: 8,
    paddingBottom: 4,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
});
