import { ref, uploadBytes } from "firebase/storage"
import { v4 } from "uuid"
import { bucket } from "."

export const fbBucket = async (img:React.ComponentState) =>{
    const imgRef = ref(bucket , `ProfilePics/${v4()}`);
    try{
        await uploadBytes(imgRef , img);
        return true;
    }
    catch{
        return false;
    }
}