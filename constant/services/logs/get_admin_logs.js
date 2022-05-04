import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import firestore_db from "../../../constant/configurations/firebase_init";

export default async function searchAdminLogs({ email }) {
  const logsRef = collection(firestore_db, "logs");
  const queue = query(logsRef, where("admin_email", "==", email));
  const docs = await getDocs(queue);
  const data = [];
  docs.forEach((doc) => data.push(doc.data()));
  return {
    success: data.length != 0,
    data: data,
    message:
      data.length != 0 ? "Search succes" : "No records found in database.",
  };
}
