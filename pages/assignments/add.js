import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "@/styles/assignments/AddAssignment.module.css";
import { useRouter } from "next/router";
 
import { MdClose } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import axios from "axios";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useSession} from 'next-auth/react';

const AddAssignment = () => {
  const {data} = useSession()
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [max_grade, setMax_grade] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [fileProgress, setFileProgress] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    setAttachments((prevAttachments) => [...prevAttachments, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDelete = (name) => {
    setAttachments(attachments.filter((f) => f.name !== name));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formattedDeadline = deadline
      ? new Date(deadline).toISOString()
      : null;

    const assignment = {
      title,
      deadline: formattedDeadline,
      description,
      max_grade: max_grade || 0,
    };

    try {
      const assignmentResponse = await axios.post(
        "http://localhost:8000/assignments/assignment/add/",
        assignment,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );

      if (assignmentResponse.status === 200) {
        const id = assignmentResponse.data.id;
        console.log("Assignment submitted successfully");
        console.log("Assignment id: ", id);

        if (attachments.length > 0) {
          for (let i = 0; i < attachments.length; i++) {
            const formData = new FormData();
            formData.append("attachment", attachments[i]);

            const config = {
              onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setFileProgress((prevProgress) => ({
                  ...prevProgress,
                  [attachments[i].name]: progress,
                }));
              },
              headers: {
                Authorization: `Bearer ${data.user.access_token}`,
                "Content-Type": "multipart/form-data",
              },
            };

            try {
              const response = await axios.post(
                `http://localhost:8000/assignments/assignment/${id}/attachment/add/`,
                formData,
                config
              );
              if (response.status === 200) {
                console.log("Attachment uploaded successfully");
                setAttachments(
                  attachments.filter((f) => f.name !== attachments[i].name)
                );

                const attachmentId = response.data.id;
                console.log("Attachment id:", attachmentId);
              }
            } catch (error) {
              console.error("Failed to upload attachment:", error);
            }
          }
        }
        setAttachments([]);
        router.back();
      } else {
        console.error("Failed to submit assignment");
        alert("Failed to submit assignment");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred while submitting assignment");
    }
  };

  return (
    <>
    <div className={styles.main}>
      <div className={styles.header}>
        <p className={styles.newAssignment}>New Assignment</p>
        <MdClose
          onClick={() => {
            router.back();
          }}
        />
      </div>
      <form onSubmit={handleFormSubmit} className={styles.inputs}>
        <div className={styles.inputContainer}>
          <label htmlFor="title">Title</label>
          <input
            required
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="description">Description (Optional)</label>
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="attachment">Attachments:</label>

          <div className={styles.dropContainer}>
            <div {...getRootProps({ className: styles.dropzone })}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag and drop some files here, or click to select files</p>
              )}
            </div>
            <div className={styles.selected}>
              {attachments.map((file) => (
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
                      <TiDelete onClick={() => handleDelete(file.name)} />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.inputsFooter}>
          <div className={styles.deadline}>
            <label htmlFor="deadline">Deadline:</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className={styles.grade}>
            <label htmlFor="grade">Max Grade:</label>
            <input
              type="text"
              id="grade"
              name="max_grade"
              value={max_grade}
              onChange={(e) => setMax_grade(e.target.value)}
            />
          </div>

          <div className={styles.submit}>
            <button tybe="submit">Submit</button>
          </div>
        </div>
      </form>
    </div></>
  );
};

export default AddAssignment;
