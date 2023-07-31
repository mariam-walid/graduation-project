import React, { useState, useEffect } from "react";
import styles from "@/styles/timeTracker.module.css";
import Timer from "@/components/timeTracker.js/Timer";
import Reports from "@/components/timeTracker.js/Reports";
import Entry from "@/components/timeTracker.js/Entry";
import { BiSolidTime, BiSolidReport } from "react-icons/bi";

const Home = () => {
  const [isVisible, setIsVisible] = useState("timer");
  const [allEntries, setAllEntries] = useState([])

  const getEntries = async () => {
    try{
      const response = await fetch('http://localhost:8000/timer/entries/')
      const data = await response.json()
      if(response.ok){
        console.log(data)
        setAllEntries(data)
      }
    } catch(error){
      console.error(error)
    }
  }

  useEffect(()=>{getEntries()},[])



  return (
    <div className={styles.main}>
      <div className={styles.sidebar}>
        <button
          className={isVisible == "timer" ? styles.isSelected : ""}
          onClick={() => setIsVisible("timer")}
        >
          <BiSolidTime /> Timer
        </button>
        <button
          className={isVisible == "reports" ? styles.isSelected : ""}
          onClick={() => setIsVisible("reports")}
        >
          {" "}
          <BiSolidReport /> Reports
        </button>
      </div>
      <div className={styles.trackContainer}>
        {isVisible == "reports" ? (
          <Reports />
        ) : (
          <div>
            <Timer getEntries={getEntries} />
            <div className={styles.entriesContainer}>
              {allEntries.map((entry)=><Entry key={entry.id} entry={entry} getEntries={getEntries}/>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
// 01012836136
