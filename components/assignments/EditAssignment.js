import React, { useState } from "react";
import styles from "@/styles/assignments/EditAssignment.module.css";
import Modal from "react-bootstrap/Modal";
import { MdEdit } from "react-icons/md";
 
import { useSession} from 'next-auth/react';


const EditAssignment = ({ assignment, getAssignments }) => {
  const {data} = useSession()
  const date =
    assignment.deadline !== null
      ? new Date(assignment.deadline).toISOString().split("T")[0]
      : "";

  const [title, setTitle] = useState(assignment.title);
  const [description, setDescription] = useState(assignment.description);
  const [deadline, setDeadline] = useState(date);
  const [max_grade, setMax_grade] = useState(assignment.max_grade);

  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDeadline = deadline
      ? new Date(deadline).toISOString()
      : null;
    const assignmentEdit = {
      title,
      deadline: formattedDeadline,
      description,
      max_grade: max_grade || 0,
    };
    const response = await fetch(
      `http://localhost:8000/assignments/assignment/${assignment.id}/edit/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.user.access_token}`,
        },
        body: JSON.stringify(assignmentEdit),
      }
    );
    if (response.ok) {
      console.log("Edit Assignment successfully");
    } else {
      console.error("Failed to edit assignment");
    }
    setShow(false);

    getAssignments();
  };

  return (
    <>
      <MdEdit onClick={() => setShow(true)} />

      <Modal
        size="lg"
        dialogClassName="modal-90w"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={() => setShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Assignment</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputContainer}>
                <label htmlFor="title">Title</label>
                <input
                  required
                  type="text"
                  className={styles.title}
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="deadline">Deadline:</label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="grade">Max Grade:</label>
                <input
                  type="text"
                  // className={styles.grade}
                  id="grade"
                  name="max_grade"
                  value={max_grade}
                  onChange={(e) => setMax_grade(e.target.value)}
                />
              </div>
              <div className={styles.editBtn}>
                <button tybe="submit">Edit Assignment</button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditAssignment;
