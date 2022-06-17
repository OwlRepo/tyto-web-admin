import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import firestore_db from "../../../configurations/firebase_init";

export default async function createTeacherSchedule({
  name,
  room_id,
  teacher_email,
  teacher_name,
  schedule_id,
  section,
  time,
}) {
  const docRef = doc(firestore_db, "schedules", schedule_id);
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
  if (isEmailExisting) {
    await updateDoc(docRef, {
      subjects: arrayUnion({
        name: name,
        room_id: room_id,
        teacher_email: teacher_email,
        teacher_name: teacher_name,
        section: section,
        time: time,
        grade_level: schedule_id,
      }),
    });
    await updateDoc(sectionRef, {
      subjects: arrayUnion({
        name: name,
        room_id: room_id,
        teacher_email: teacher_email,
        teacher_name: teacher_name,
        section: section,
        time: time,
        grade_level: schedule_id,
      }),
    });

    await setDoc(logsRef, {
      action: "CREATE_TEACHER_SCHEDULE",
      admin_email: `${localStorage.getItem("email")}`,
      user_email: teacher_email,
      timestamp: date.toString(),
      description: `${localStorage.getItem(
        "email"
      )} created a teacher schedule with an email of ${teacher_email}`,
    });

    return { success: true, message: "SCHEDULE Created Successfully." };
  } else {
    return { success: false, message: "SCHEDULE Creation Failed." };
  }
}
