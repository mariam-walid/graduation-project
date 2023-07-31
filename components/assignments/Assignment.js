import styles from "@/styles/assignments/Assignment.module.css";
import EditAssignment from "@/components/assignments/EditAssignment";
import { FaTrashAlt, FaDownload } from "react-icons/fa";
import { RxExternalLink } from "react-icons/rx";
import Link from "next/link";
import { useState, useEffect } from "react";
 
import Upload from "@/components/assignments/Upload";
import { useSession} from 'next-auth/react';

const Assignment = ({ assignment, deleteAssignment, getAssignments }) => {
  const { data } = useSession()
  console.log(useSession())

  const [attachments, setAttachments] = useState([]);
  const [show, setShow] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  const fetchCurrentUser = async () => {
    if (data) {
      const response = await fetch(`http://localhost:8000/users/me/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.user.access_token}`,
        },
      });
      const userData = await response.json();
      setCurrentUser(userData.id);
      }
  };
  const fetchAttachments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/assignments/assignment/${assignment.id}/attachment`
      );
      const attachData = await response.json();
      setAttachments(attachData);
    } catch (error) {
      console.error(
        `Error fetching attachments for assignment ${assignment.id}:`,
        error
      );
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchAttachments();
  }, [assignment.id, show,data]);

  const handleDownload = (attachmentId) => {
    window.open(
      `http://localhost:8000/assignments/attachment/${attachmentId}`,
      "_blank"
    );
  };

  const handleDelete = async (attachmentId) => {
    const response = await fetch(
      `http://localhost:8000/assignments/attachment/${attachmentId}/delete/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.user.access_token}`,
        },
      }
    );

    if (response.ok) {
      console.log("Attachment deleted successfully");
    } else {
      console.error("Failed to delete attachment");
    }

    fetchAttachments();
  };
  // if(status = 'loading'){
  //   return <h1>Loading</h1>
  // }
  return (
    <div className={styles.assignment}>
      <div className={styles.deadline}>
        <p className={styles.due}>DUE</p>
        {assignment.deadline !== null ? (
          <p className={styles.date}>
            {new Date(assignment.deadline).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
        ) : (
          <p className={styles.noDue}>No DUE</p>
        )}
      </div>
      <span className={styles.line}></span>

      <div className={styles.assignmentInfo}>
        <p className={styles.assignmentTitle}>
          {assignment.owner.username} posted assignment: {assignment.title}
          <Link key={assignment.id} href={`assignments/${assignment.id}`}>
            <RxExternalLink />
          </Link>
        </p>
        <p className={styles.assignmentDescription}>{assignment.description}</p>
        {assignment.max_grade !== 0 && (
          <p className={styles.assignmentDescription}>
            Max grade: {assignment.max_grade}
          </p>
        )}

        <div className={styles.assignmentAttachments}>
          {attachments.length > 0 && (
            <>
              <div className={styles.attachmentsWrapper}>
                {attachments.map((attachment) => (
                  <div className={styles.attachmentDetails} key={attachment.id}>
                    <span key={attachment.id}>{attachment.filename}</span>
                    <FaDownload onClick={() => handleDownload(attachment.id)} />
                    {currentUser == assignment.owner.id && (
                      <FaTrashAlt onClick={() => handleDelete(attachment.id)} />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        {currentUser == assignment.owner.id && (
          <h6>
            <Link
              key={assignment.id}
              href={`assignments/allWork/${assignment.id}`}
            >
              View users work
            </Link>
          </h6>
        )}
      </div>
      {currentUser == assignment.owner.id && (
        <div>
          <div className={styles.options}>
            <span className={styles.edit}>
              <Upload
                assignmentId={assignment.id}
                show={show}
                setShow={setShow}
              />
            </span>
            <span className={styles.edit}>
              <EditAssignment
                assignment={assignment}
                getAssignments={getAssignments}
              />
            </span>
            <span className={styles.delete}>
              <FaTrashAlt onClick={() => deleteAssignment(assignment.id)} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignment;
