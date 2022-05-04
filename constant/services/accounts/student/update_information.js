import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import firestore_db from "../../../configurations/firebase_init";

export default async function updateAccountInformation({
  email,
  fullname,
  schedule_id,
  password,
}) {
  const docRef = doc(firestore_db, "accounts_student", email);
  const docData = await getDoc(docRef);
  const isEmailExisting = docData.exists();
  var date = new Date();

  const logsRef = doc(firestore_db, "logs", date.toString());

  if (isEmailExisting) {
    await updateDoc(docRef, {
      fullname: fullname,
      schedule_id: schedule_id,
      password: password,
    });

    await setDoc(logsRef, {
      action: "UPDATE_STUDENT_ACCOUNT",
      admin_email: `${localStorage.getItem("email")}`,
      user_email: email,
      timestamp: date.toString(),
      description: `${localStorage.getItem(
        "email"
      )} updated a teacher account with an email of ${email}`,
    });
    return { success: true, message: "Updated Successfully." };
  } else {
    return { success: false, message: "Update Failed." };
  }
}
