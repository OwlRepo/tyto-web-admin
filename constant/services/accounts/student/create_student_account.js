import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import firestore_db from "../../../configurations/firebase_init";
import emailjs from "@emailjs/browser";
export default async function createStudentAccount({
  email,
  fullname,
  schedule_id,
  password,
  section,
}) {
  const docRef = doc(firestore_db, "accounts_student", email);
  const docData = await getDoc(docRef);
  const isEmailExisting = docData.exists();
  var date = new Date();

  const logsRef = doc(firestore_db, "logs", date.toString());
  const sectionRef = doc(
    firestore_db,
    "sections",
    schedule_id,
    section,
    section
  );

  if (!isEmailExisting) {
    await setDoc(docRef, {
      email: email,
      fullname: fullname,
      schedule_id: schedule_id,
      section: section,
      password: password,
      is_default_password: true,
      is_banned: false,
    });
    await updateDoc(sectionRef, {
      students: arrayUnion({
        email: email,
        fullname: fullname,
        schedule_id: schedule_id,
        section: section,
      }),
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
    };
    emailjs
      .send("gmail", "student_3wpp5ml", tempForm, "Y6V4R9pex9SHw_tOA")
      .then((result) => {
        console.log("Email Successfully Sent");
      })
      .catch((err) => console.log("Email not sent"));

    return { success: true, message: "Account Created Successfully." };
  } else {
    return { success: false, message: "Account Creation Failed." };
  }
}
