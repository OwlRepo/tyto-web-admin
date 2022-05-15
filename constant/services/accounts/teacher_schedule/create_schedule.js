import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import firestore_db from "../../../configurations/firebase_init";

export default async function createTeacherSchedule({
    name,
    room_id,
    teacher_email,
    teacher_name,
    schedule_id,
    time
}) {
    const docRef = doc(firestore_db, "schedules", schedule_id);
    const docData = await getDoc(docRef);
    const isEmailExisting = docData.exists();
    var date = new Date();

    const logsRef = doc(firestore_db, "logs", date.toString());

    if (isEmailExisting) {
        await updateDoc(docRef, {subjects: arrayUnion({
            name: name,
            room_id: room_id,
            teacher_email: teacher_email,
            teacher_name: teacher_name,
            time: time
        })});

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
