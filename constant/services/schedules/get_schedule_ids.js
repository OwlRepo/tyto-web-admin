import { collection,doc,getDoc, getDocs } from 'firebase/firestore'
import firestore_db from '../../configurations/firebase_init'

export default async function getScheduleIDs (){
  const collectionRef = collection(firestore_db,'schedules')
  const docData = await getDocs(collectionRef)
  var scheduleIDS = []
  docData.forEach(doc=>{scheduleIDS.push({id:doc.id})})
  return scheduleIDS;
}
