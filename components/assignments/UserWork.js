import React, { useState, useEffect } from "react";
import {FaDownload } from "react-icons/fa";
import styles from "@/styles/assignments/UserWork.module.css";
 
import {BsCheckLg } from "react-icons/bs";
import { useSession} from 'next-auth/react';

const UserWork = ({work}) => {
    const {data} = useSession()
    const [workAttachments, setWorkAttachments] = useState([]);
    const [grade, setGrade] = useState(work.grade);
    const [updated, setUpdated] = useState(false)

    const fetchWorkAttachments = async () => {
        const response = await fetch(
          `http://localhost:8000/assignments/work/${work.id}/attachment/`
        );
    
        const attachments = await response.json();
      setWorkAttachments( attachments);
      console.log("work", workAttachments);
      }; 

      useEffect(()=>{
        fetchWorkAttachments();
      },[work.id,workAttachments.length])


      const handleDownload = (attachmentId) => {
        window.open(
          `http://localhost:8000/assignments/attachment/${attachmentId}`,
          "_blank"
        );
      };

      const updateGrade = async () => {
        const response = await fetch(
          `http://localhost:8000/assignments/work/${work.id}/grade/${grade}`,{
            method:'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.user.access_token}`,
              },
          }
        );
            if(response.ok){
                console.log('Grade updated successfully')
                setUpdated(true)
            }
      
      }; 
      

  return (
    <div className={styles.work}>
      
        <p className={styles.title}>Work for user: {work.owner.username}</p> 
        <div className={styles.workDetails}>
        <div className={styles.workAttachments}>
        {
        workAttachments.map(attach=>(
            <div key={attach.id} className={styles.attachment} >
                <p>{attach.filename}</p>
                <FaDownload onClick={()=> handleDownload(attach.id)} />
            </div>
        ))
      } 
        </div>
      
      <div className={styles.grade}>
        <div>
        <label htmlFor="grade">Grade</label>
          <input
            type="text"
            id="grade"
            name="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </div>
          
          <button onClick={()=>updateGrade()}>Update</button>
          {updated && <div> 
            <span> User grade updated </span>
            <BsCheckLg/>
             </div>}
        </div>
        </div>
        
        
      
    </div>
  )
}

export default UserWork
