import { Alert } from "react-native";

const handleFirebaseAuthErrors = (error) => {
  if (error.code === "auth/invalid-email") {
    return "Please enter valid email address";
  } else if (error.code === "auth/user-not-found") {
    return "No account found with this email";
  } else if (error.code === "auth/wrong-password") {
    return "Incorrect password. Please try again";
  } else if (error.code === "auth/invalid-credential") {
    return "Incorrect email or password. Please check your credentials and try again";
  } else if (error.code === "auth/network-request-failed") {
    return "Network error. Please check your internet connection";
  } else if (error.code === "auth/email-already-in-use") {
    return "Email already in use, please login";
  }
  return "Authentication failed. Please try again";
};

const handleSignupValidation = (email, password, name) => {
  if (!email.trim()) {
    Alert.alert("Please enter your email");
    return false;
  }
  if (!password.trim()) {
    Alert.alert("Please enter your password");
    return false;
  }
  if (!name.trim()) {
    Alert.alert("Please enter your Name");
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert("Please enter a valid email address");
    return false;
  }
  // Validate lowercase letters
  const lowerCaseLetters = /[a-z]/g;
  if (!password.match(lowerCaseLetters)) {
    Alert.alert("Password must contain atleast 1 lower");
    return false;
  }

  // Validate capital letters
  const upperCaseLetters = /[A-Z]/g;
  if (!password.match(upperCaseLetters)) {
    Alert.alert("Password must contain alteast one upper case");
    return false;
  }

  // Validate numbers
  const numbers = /[0-9]/g;
  if(name.match(numbers)){
    Alert.alert("Name should not contain numbers")
    return false;
  }

  // Validate length
  if (password.length <= 8) {
    Alert.alert("Password must contain alteast 8 characters");
    return false;
  }
  return true;
};

const handleLoginValidation = (email, password) => {
   if (!email.trim()) {
    Alert.alert("Please enter your email");
    return false;
  }
  if (!password.trim()) {
    Alert.alert("Please enter your password");
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert("Please enter a valid email address");
    return false;
  }
  return true
}

export { handleFirebaseAuthErrors, handleSignupValidation, handleLoginValidation };
