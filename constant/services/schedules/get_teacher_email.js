import { collection,doc,getDoc, getDocs } from 'firebase/firestore'
import firestore_db from '../../configurations/firebase_init'

export default async function getEmails (){
  const collectionRef = collection(firestore_db,'accounts_teacher')
  const docData = await getDocs(collectionRef)
  var teacherEmails = []
  docData.forEach(doc=>{teacherEmails.push({teacherEmail:doc.id})})
  return teacherEmails;
}
