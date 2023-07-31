import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "@/styles/assignments/Upload.module.css";
 
import axios from "axios";
import ProgressBar from "react-bootstrap/ProgressBar";
import Modal from "react-bootstrap/Modal";
import { ImAttachment } from "react-icons/im";
import { TiDelete } from "react-icons/ti";
import { useSession} from 'next-auth/react';

const Upload = ({ assignmentId, show, setShow }) => {
  const {data} = useSession()
  const [files, setFiles] = useState([]);
  const [fileProgress, setFileProgress] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDelete = (name) => {
    setFiles(files.filter((f) => f.name !== name));
  };

  const handleSubmit = async (e) => {
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
          `http://localhost:8000/assignments/assignment/${assignmentId}/attachment/add/`,
          formData,
          config
        );
        console.log("Attachment uploaded successfully");
        setFiles(files.filter((f) => f.name !== files[i].name));

        const attachmentId = response.data.id;
        console.log("Attachment id:", attachmentId);
      } catch (error) {
        console.error("Failed to upload attachment:", error);
      }
    }

    setFiles([]);
    setShow(false);
  };

  return (
    <div>
      <ImAttachment
        onClick={() => {
          setShow(true);
          console.log(assignmentId);
        }}
      />
      <Modal
        size="lg"
        dialogClassName="modal-90w"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={() => {
          setShow(false);
          setFiles([]);
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Attachments</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form className={styles.container} onSubmit={handleSubmit}>
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
                      <TiDelete onClick={() => handleDelete(file.name)} />
                    </>
                  )}
                </div>
              ))}
            </div>
            {files.length !== 0 && <button type="submit">Submit</button>}
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Upload;
