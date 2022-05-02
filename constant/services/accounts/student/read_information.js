import { collection, doc, getDoc } from "firebase/firestore";
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

  return isEmailExisting
    ? emailExistResponse({ data: docData.data() })
    : emailNotExistingResponse();
}
