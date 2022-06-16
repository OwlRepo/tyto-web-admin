import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import firestore_db from "../../configurations/firebase_init";

export default async function createSection({ section, schedule_id, room_id }) {
  const docRef = doc(firestore_db, "sections", schedule_id, section, section);
  const docRef1 = doc(firestore_db, "sections", schedule_id);
  const docData = await getDoc(docRef);
  const data = docData.exists();
  var date = new Date();

  const logsRef = doc(firestore_db, "logs", date.toString());

  if (!data) {
    await setDoc(docRef, {
      room_id: room_id,
      section: section,
      grade_level: schedule_id,
    });
    await setDoc(docRef1, {
      section: arrayUnion({
        section: section,
        grade_level: schedule_id,
      }),
    });

    await setDoc(logsRef, {
      action: "CREATE_SECTION",
      admin_email: `${localStorage.getItem("email")}`,
      section: section,
      grade_level: schedule_id,
      timestamp: date.toString(),
      description: `Section created`,
    });

    return { success: true, message: "SCHEDULE Created Successfully." };
  } else {
    return { success: false, message: "SCHEDULE Creation Failed." };
  }
}
