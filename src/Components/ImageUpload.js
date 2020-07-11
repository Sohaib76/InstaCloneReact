import React , {useState} from 'react'
import { Button, LinearProgress } from '@material-ui/core'
import firebase from 'firebase'
import {storage,db} from '../firebase.js'
import './ImageUpload.css'

function ImageUpload({username}) {

    const [caption,setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0)

    const handleChange = (e) =>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }

    const handleUpload = ()=>{
        const uploadImage = storage.ref(`images/${image.name}`)
        .put(image);

        uploadImage.on(
            "state_changed",
            (snapshot) => {
                //progress
                const progress = Math.round(
                    (snapshot.bytesTransferred/ snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },
            
            (error) => {
                alert(error.message);
            }
            
            
            //Getting image after upload
            ,()=>{
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    //post to database
                    db.collection('posts').add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl : url,
                        username:username
                    })

                    setProgress(0)
                    setCaption("")
                    setImage(null)
                })
            }
        )
    }


    return (
        <div className="imageupload">
            <LinearProgress variant="determinate" value={progress} max="100"/>
            {/* <progress className="imageupload__progress" value={progress} max="100"/> */}
            <input className="imageupload__caption" type="text" placeholder="Enter a caption here.."
                value={caption} onChange={event=> setCaption(event.target.value)}
            />
            <input className="imageupload__file" type='file' onChange={handleChange}/>
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
