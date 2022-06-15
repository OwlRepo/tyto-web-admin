import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import firestore_db from "../../../configurations/firebase_init";

const emailExistResponse = ({ data }) => ({
  success: true,
  message: "Search successful.",
  data: [
    {
      email: data.email,
      fullname: data.fullname,
      schedule_id: data.schedule_id,
      password: data.password,
    },
  ],
});

const emailNotExistingResponse = () => ({
  success: false,
  message: "Email does not exist.",
});

export default async function searchAccountInformation({ email }) {
  const docRef = doc(firestore_db, "accounts_student", email);
  const docData = await getDoc(docRef);
  const isEmailExisting = docData.exists();
  var date = new Date();

  const logsRef = doc(firestore_db, "logs", date.toString());

  await setDoc(logsRef, {
    action: "SEARCH_STUDENT_ACCOUNT",
    admin_email: `${localStorage.getItem("email")}`,
    user_email: email,
    timestamp: date.toString(),
    description: `${localStorage.getItem(
      "email"
    )} searched an student account with an email of ${email}`,
  });

  return isEmailExisting
    ? emailExistResponse({ data: docData.data() })
    : emailNotExistingResponse();
}
