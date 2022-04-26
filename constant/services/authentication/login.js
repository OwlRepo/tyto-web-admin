import { collection,doc,getDoc } from 'firebase/firestore'
import firestore_db from '../../configurations/firebase_init'

const wrongEmailResponse = {success:false,message:'Email does not exist.'}
const wrongPasswordResponse = {success:false,message:'Wrong password.'}
const authorizedLoginResponse = {success:true,message:'Login authorized.'}

export default async function validateLogin ({email,password}){
  const docRef = doc(firestore_db,'accounts_admin',email)
  const docData = await getDoc(docRef)
  const isEmailExisting = docData.exists()

  if (isEmailExisting){
    const accountPassword = docData.data()['password']
    return accountPassword === password ? authorizedLoginResponse : wrongPasswordResponse
  }
  else{
    return wrongEmailResponse
  }
}
