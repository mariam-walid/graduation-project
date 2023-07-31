import React, { useState, useEffect} from "react";
import { useRouter } from "next/router";
import UserWork from '@/components/assignments/UserWork'
import styles from "@/styles/assignments/Home.module.css";
import {BiSolidChevronsLeft} from "react-icons/bi";

const AllWork = () => {

    const router = useRouter();
  const assignmentId = router.query.assignmentId;

  const [allWork, setAllWork] = useState(null)

  const fetchAllWork = async () => {
    const response = await fetch(`http://localhost:8000/assignments/assignment/${assignmentId}/work/`)
    const data = await response.json()
    if (response.ok){
        setAllWork(data)
    }
  }

  useEffect(()=>{
    if(assignmentId){
        fetchAllWork();
    }
  },[assignmentId])

  if (!allWork) {
    return (
      <div className={styles.loading}>
        <h1>Loading....</h1>
      </div>
    );
  }

  return (
    <>
    <div className={styles.main}>
      <div className={styles.header}>
      <div className={styles.allA} onClick={() => router.back()}>
          <BiSolidChevronsLeft /> 
          <span>All Assignments</span>
        </div>
          <h1>All works</h1>
        </div>
      {allWork.length > 0 && (
          <div className={styles.assignmentsContainer}>
            {
        allWork.map(work=>(
            <UserWork key={work.id} work={work}/>
        ))
      }
          </div>
        )}
        {allWork.length === 0 && (
          <div className={styles.noAssignments}>
            <h5>No Work!</h5>
          </div>
        )}
    </div>
    </>
    
  )
}

export default AllWork
