import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import ProgressBar from "react-bootstrap/ProgressBar";
import { FaTrashAlt } from "react-icons/fa";
import styles from "@/styles/assignments/Work.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import {BiSolidChevronsLeft} from "react-icons/bi";
import { useSession} from 'next-auth/react';

export default function Work() {
  const {data} = useSession()
  const router = useRouter();
  const assignmentId = router.query.assignmentId;

  const [workId, setWorkId] = useState(null);
  const [workAttachments, setWorkAttachments] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [grade, setGrade] = useState();
  const [files, setFiles] = useState([]);
  const [fileProgress, setFileProgress] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const fetchWork = async () => {
    if (data) {
      const response = await fetch(
        `http://localhost:8000/assignments/assignment/${assignmentId}/work/me/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );
      const workData = await response.json();

      if (workData) {
        setWorkId(workData.id);
        setIsSubmitted(workData.is_submitted);
        setGrade(workData.grade);
      }
    }
  };
  const fetchWorkAttachments = async () => {
    const response = await fetch(
      `http://localhost:8000/assignments/work/${workId}/attachment/`
    );

    const attachments = await response.json();
    setWorkAttachments(attachments);
    console.log("work", workAttachments);
  };

  useEffect(() => {
    if (assignmentId) {
      fetchWork();
    }
  }, [assignmentId, workId,data]);

  useEffect(() => {
    if (workId) {
      fetchWorkAttachments();
    }
  }, [workId, workAttachments.length]);

  const uploadAttachment = async (e) => {
    e.preventDefault();
    if (!files?.length) return;

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("attachment", files[i]);

      const config = {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setFileProgress((prevProgress) => ({
            ...prevProgress,
            [files[i].name]: progress,
          }));
        },
        headers: {
          Authorization: `Bearer ${data.user.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      try {
        const response = await axios.post(
          `http://localhost:8000/assignments/assignment/${assignmentId}/work/add/`,
          formData,
          config
        );
        if (response.status == 200) {
          console.log("Attachment uploaded successfully");
          setWorkAttachments((prev) => [...prev, files]);
          setFiles(files.filter((f) => f.name !== files[i].name));
          unSubmitWork();
          fetchWork();
        }
      } catch (error) {
        console.error("Failed to upload attachment:", error);
      }
    }

    setFiles([]);
  };

  const deleteAttachment = async (attachId) => {
    const response = await fetch(
      `http://localhost:8000/assignments/attachment/${attachId}/delete/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.user.access_token}`,
        },
      }
    );
    if (response.ok) {
      console.log("Attachment deleted successfully");
      setWorkAttachments(workAttachments.filter((item) => item.id != attachId));
      unSubmitWork();
    } else {
      console.log("Failed to delete attachment");
    }
  };
  const submitWork = async () => {
    const response = await fetch(
      `http://localhost:8000/assignments/work/${workId}/submit/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.user.access_token}`,
        },
      }
    );

    if (response.ok) {
      console.log("Work submitted successfully");
      setIsSubmitted(true);
    }
  };

  const unSubmitWork = async () => {
    const response = await fetch(
      `http://localhost:8000/assignments/work/${workId}/unsubmit/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.user.access_token}`,
        },
      }
    );

    if (response.ok) {
      console.log("Work unsubmitted successfully");
      setIsSubmitted(false);
    }
  };

  return (
    <>
    <div className={styles.main}>
      <div className={styles.allA} onClick={() => router.back()}>
          <BiSolidChevronsLeft/>
          <span>All Assignments</span>
        </div>
      <div className={styles.header}>
        <h1>Your work</h1>
        {workId != null && workAttachments.length > 0 && (
          <div>
            {isSubmitted ? (
              <button
                className={styles.submitWork}
                onClick={() => unSubmitWork()}
              >
                Un submit
              </button>
            ) : (
              <button
                className={styles.submitWork}
                onClick={() => submitWork()}
              >
                Submit
              </button>
            )}
          </div>
        )}
      </div>
      <div className={styles.workDetails}>
        {workAttachments.map((attach) => (
          <div key={attach.id} className={styles.attachment}>
            <p>{attach.filename}</p>
            <span>
              <FaTrashAlt onClick={() => deleteAttachment(attach.id)} />
            </span>
          </div>
        ))}
        {isSubmitted == true && workAttachments.length > 0 && (
          <p className={styles.grade}>Your grade: {grade} </p>
        )}

        <form className={styles.dropContainer} onSubmit={uploadAttachment}>
          <div {...getRootProps({ className: styles.dropzone })}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag and drop some files here, or click to select files</p>
            )}
          </div>
          <div className={styles.selected}>
            {files.map((file) => (
              <div className={styles.selectedItem} key={file.name}>
                {fileProgress[file.name] !== 100 && (
                  <>
                    <p>{file.name}</p>
                    <ProgressBar
                      className={styles.progress}
                      variant="success"
                      animated
                      now={
                        fileProgress[file.name] ? fileProgress[file.name] : 0
                      }
                      label={`${
                        fileProgress[file.name] ? fileProgress[file.name] : 0
                      }%`}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
          {files.length !== 0 && (
            <button className={styles.upload} type="submit">
              Upload
            </button>
          )}
        </form>
      </div>
    </div>
    </>
    
  );
}
