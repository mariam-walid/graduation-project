import React, { useState, useEffect } from "react";
import styles from "@/styles/qna/Answer.module.css";
import {
  BiSolidChevronUpSquare,
  BiSolidChevronDownSquare,
} from "react-icons/bi";
import { BsPatchCheckFill, BsFilePerson, BsCheckLg } from "react-icons/bs";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";

import Modal from "react-bootstrap/Modal";
import AllComments from "./comments/AllComments";
import { useSession } from 'next-auth/react';


const Answer = ({ answer, fetchAnswers, questionAuthor }) => {
  const { data } = useSession()
  const [show, setShow] = useState(false);
  const [answerEdited, setAnswerEdited] = useState(answer.content);
  const [isAccepted, setIsAccepted] = useState(answer.is_accepted);
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
      console.log(questionAuthor)
    }
  };
  useEffect(() => {
    fetchCurrentUser();
  }, [data, questionAuthor]);
  const handleDiscard = () => {
    setShow(false);
    setAnswerEdited(answer.content);
  };

  const handleEdit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/qna/answer/${answer.id}/edit/`,
        { content: answerEdited },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Answer edited");
        fetchAnswers();
        setShow(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/qna/answer/${answer.id}/delete/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );
      if (response.ok) {
        console.log("Answer deleted");
        fetchAnswers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAccept = async () => {
    if (isAccepted) {
      try {
        const response = await fetch(
          `http://localhost:8000/qna/answer/${answer.id}/accept/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.user.access_token}`,
            },
          }
        );

        if (response.ok) {
          console.log("Answer accepted");
          fetchAnswers();
        }
      } catch (error) {
        console.error(error);
      }
    } else if (!isAccepted) {
      try {
        const response = await fetch(
          `http://localhost:8000/qna/answer/${answer.id}/accept/undo/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.user.access_token}`,
            },
          }
        );

        if (response.ok) {
          console.log("Answer accept undo");
          fetchAnswers();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    handleAccept();
  }, [isAccepted]);

  const handleUpvote = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/qna/answer/${answer.id}/upvote/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Answer upvoted");
        fetchAnswers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const upvoteUndo = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/qna/answer/${answer.id}/upvote/undo/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Answer upvote undo");
        fetchAnswers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownvote = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/qna/answer/${answer.id}/downvote/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Answer downvoted");
        fetchAnswers();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const downvoteUndo = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/qna/answer/${answer.id}/downvote/undo/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Answer downvote undo");
        fetchAnswers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.answerContainer}>
      <div className={styles.answerHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.answerVote}>
            <BiSolidChevronUpSquare onClick={handleUpvote} />
            <span>{answer.upvotes - answer.downvotes}</span>
            <BiSolidChevronDownSquare onClick={handleDownvote} />
          </div>
          <div className={styles.answerContent}>
            {isAccepted && (
              <span>
                <BsPatchCheckFill />
              </span>
            )}
            <p>{answer.content}</p>
          </div>
        </div>
        <div className={styles.answerActions}>
          {currentUser == answer.author.id && (
            <>
              <MdEdit className={styles.edit} onClick={() => setShow(true)} />
              <MdDelete className={styles.delete} onClick={handleDelete} />
            </>
          )}
          {
            currentUser == questionAuthor && (
              <BsCheckLg
                className={isAccepted ? styles.accepted : styles.accept}
                onClick={() => setIsAccepted(!isAccepted)}
              />
            )
          }
          
        </div>
      </div>
      <div className={styles.answerAuthor}>
        <p className={styles.author}>
          <BsFilePerson /> {answer.author.username}{" "}
        </p>
        <p className={styles.aDate}>
          Created at {new Date(answer.date_created).toLocaleDateString()}
        </p>
      </div>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Answer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.inputContainer}>
            <label>Answer</label>
            <textarea
              required
              value={answerEdited}
              onChange={(e) => setAnswerEdited(e.target.value)}
            />
          </div>
          <div className={styles.actions}>
            <button
              disabled={answer.content == answerEdited}
              onClick={handleEdit}
              className={`${answerEdited === answer.content ? '' : styles.post}`}
            >
              Edit
            </button>
            <button onClick={handleDiscard} className={styles.discard}>Discard</button>
          </div>

        </Modal.Body>
      </Modal>

      <AllComments answerId={answer.id} />
    </div>
  );
};

export default Answer;
