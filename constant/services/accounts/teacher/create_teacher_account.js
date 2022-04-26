import { doc,getDoc, setDoc } from 'firebase/firestore'
import firestore_db from '../../../configurations/firebase_init'

export default async function createTeacherAccount ({email,fullname,schedule_id,password}){
  const docRef = doc(firestore_db,'accounts_teacher',email)
  const docData = await getDoc(docRef)
  const isEmailExisting = docData.exists()
  
  if (!isEmailExisting){
    await setDoc(docRef,{
      email:email,
      fullname:fullname,
      schedule_id:schedule_id,
      password:password,
    })
    return {success:true,message:'Account Created Successfully.'}
  }
  else{
    return {success:false,message:'Account Creation Failed.'}
  }
}
