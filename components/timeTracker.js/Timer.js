import React, { useState, useEffect } from "react";
import styles from "@/styles/timeTracker.module.css";
import { BsCollectionFill } from "react-icons/bs";
import { MdNotStarted, MdStopCircle } from "react-icons/md";
import { useSession } from "next-auth/react";
// import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import { MdDelete } from "react-icons/md";
import {AiOutlineClose} from "react-icons/ai"

const Timer = ({ getEntries }) => {
  const { data } = useSession();
  // console.log(useSession())
  const [show, setShow] = useState(false);
  const [entryName, setEntryName] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [selected, setSelected] = useState("");
  const [added, setAdded] = useState("");
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours}:${padTime(minutes)}:${padTime(seconds)}`;
  };

  const padTime = (time) => {
    return String(time).padStart(2, "0");
  };

  const startTimer = () => {
    const start = new Date().toISOString();
    setIsRunning(true);
    setStartTime(start);
  };
  const stopTimer = async () => {
    setTime(0);
    setEntryName('');
    setSelected('')
    setIsRunning(false);
    setProjectId(null);
    const entryData = {
      name: entryName,
      start_datetime: startTime,
      end_datetime: new Date().toISOString(),
      ...(projectId !== null && { project_id: projectId }),
    };
    if (entryName.trim().length > 0) {
      try {
        const response = await fetch(
          "http://localhost:8000/timer/entries/create/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.user.access_token}`,
            },
            body: JSON.stringify(entryData),
          }
        );
        if (response.ok) {
          getEntries();
          console.log(response);
        }
      } catch (error) {
        console.error(error);
      }
    }
    
  };

  const getProjects = async () => {
    try {
      const response = await fetch("http://localhost:8000/timer/projects/");
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setAllProjects(data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getProjects();
  }, []);

  const addProject = async (projectName) => {
    try {
      const response = await fetch(
        `http://localhost:8000/timer/projects/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          },
          body: JSON.stringify(projectName),
        }
      );
      const projectData = await response.json();
      if (response.ok) {
        getProjects();
        setProjectId(projectData.id);
        console.log("Project created", projectData);
        setShow(false);
        setSelected(projectName)
      }
    } catch (error) {
      console.error(error);
    }
  };
  const deleteProjectEntity = async (projectId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/timer/projects/${projectId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          }
        }
      );
      if (response.ok) {
        getProjects();
        console.log('Project deleted');
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className={styles.timer}>
      <input
        value={entryName}
        type="text"
        placeholder="What are you working on?"
        onChange={(e) => setEntryName(e.target.value)}
      />

      <div className={styles.actions}>
        <p className={styles.projectName}>{selected}</p>
        <span className={styles.groupIcon}>
          {/* <BsCollectionFill/> */}
          <Dropdown data-bs-theme="dark">
            <Dropdown.Toggle
              id="dropdown-button-dark-example1"
              variant="secondary"
            >
              Add Project
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSelected("")}>
                No Project
              </Dropdown.Item>
              {allProjects.map((project) => (
                <Dropdown.Item
                  key={project.id}
                  
                  className={styles.dropItem}
                >
                  <span onClick={() => {
                    setSelected(project.name);
                    setProjectId(project.id);
                  }}>{project.name}</span>
                  <span className={styles.delete} onClick={()=>deleteProjectEntity(project.id)}><AiOutlineClose/></span>
                </Dropdown.Item>
              ))}
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => setShow(true)}>
                Add another one
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </span>

        <p>{formatTime(time)}</p>
        <span
          className={`${styles.timeIcon} ${isRunning ? styles.running : ""}`}
        >
          {isRunning ? (
            <MdStopCircle onClick={stopTimer} />
          ) : (
            <MdNotStarted onClick={startTimer} />
          )}
        </span>
      </div>
      <Modal show={show} onHide={() => setShow(false)} >
        <Modal.Body>
          <div className={styles.modal}>
            <input type="text" onChange={(e) => setAdded(e.target.value)} />
            <button onClick={() => addProject(added)}>+</button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Timer;
