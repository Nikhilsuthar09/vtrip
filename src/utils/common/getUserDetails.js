import { getAuth } from "firebase/auth";

const auth = getAuth();
const name = auth?.currentUser?.displayName;
const cleanedName = name.trim().replace(/\s+/g, " ");
const splitted = cleanedName.split(" ");
const firstName = splitted[0];
const userNameChars = splitted[0][0] + splitted[splitted.length - 1][0];
console.log(firstName)
export { firstName, userNameChars };
