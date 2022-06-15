import { doc, getDoc, setDoc } from "firebase/firestore";
import firestore_db from "../../../configurations/firebase_init";
import emailjs from "@emailjs/browser";
export default async function createStudentAccount({
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

  if (!isEmailExisting) {
    await setDoc(docRef, {
      email: email,
      fullname: fullname,
      schedule_id: schedule_id,
      password: password,
    });

    await setDoc(logsRef, {
      action: "CREATE_STUDENT_ACCOUNT",
      admin_email: `${localStorage.getItem("email")}`,
      user_email: email,
      timestamp: date.toString(),
      description: `${localStorage.getItem(
        "email"
      )} created a student account with an email of ${email}`,
    });
    const tempForm = {
      from_name: "TYTO Service",
      to_name: fullname,
      email: email,
      password: password,
      to_email: email,
    }
    emailjs.send('gmail', 'student_3wpp5ml', tempForm, 'Dcp-bAKIFgquCBCxl')
            .then((result) => {console.log('Email Successfully Sent')})
            .catch(err => console.log('Email not sent'))

    return { success: true, message: "Account Created Successfully." };
  } else {
    return { success: false, message: "Account Creation Failed." };
  }
}
