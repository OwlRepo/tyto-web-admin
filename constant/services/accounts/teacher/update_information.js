import { collection,doc,getDoc, updateDoc } from 'firebase/firestore'
import firestore_db from '../../../configurations/firebase_init'

export default async function updateAccountInformation ({email,fullname,schedule_id,password}){
  const docRef = doc(firestore_db,'accounts_teacher',email)
  const docData = await getDoc(docRef)
  const isEmailExisting = docData.exists()
  
  if (isEmailExisting){
    await updateDoc(docRef,{
      fullname:fullname,
      schedule_id:schedule_id,
      password:password,
    })
    return {success:true,message:'Updated Successfully.'}
  }
  else{
    return {success:false,message:'Update Failed.'}
  }
}
