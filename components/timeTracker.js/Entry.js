import React, {useState, useEffect} from 'react'
import styles from "@/styles/timeTracker.module.css";
import { MdDelete } from "react-icons/md";
import { useSession } from "next-auth/react";

const Entry = ({entry, getEntries}) => {
  const { data } = useSession();
  const start = new Date(entry.start_datetime).toLocaleString();
  const end = new Date(entry.end_datetime).toLocaleString();
  const [projectName, setProjectName] = useState('')

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/timer/entries/${entry.id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          }
        }
      );
      if (response.ok) {
        getEntries();
        console.log('Entry deleted');
      }
    } catch (error) {
      console.error(error);
    }
  }
useEffect(()=>{
  const getProject = async () => {
    if(entry.project){
      try{
        const response = await fetch(`http://localhost:8000/timer/projects/${entry.project.id}`)
        const projectData = await response.json()
        if(response.ok){
          console.log(projectData)
          setProjectName(projectData.name)
        }
      } catch(error){
        console.error(error)
      }
    }
    
}
getProject()
}
,[entry])
  return (
    <div className={styles.entry}>
      <div className={styles.entryTitle}>
        <p>{entry.name}</p>
        <p className={styles.projectName}>{projectName}</p>
      </div>
      <div className={styles.entryTime}>
        <p>{start} -  {end}</p>
        <p>{formatTime(Math.floor(entry.duration))}</p>
        <span className={styles.delete} onClick={handleDelete}><MdDelete/></span>
      </div>
      
    </div>
  )
}

export default Entry
