import React, { useState } from "react";
 
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/qna/Comments.module.css";
import {
  BiSolidChevronUpSquare,
  BiSolidChevronDownSquare,
} from "react-icons/bi";
import { MdEdit, MdDelete } from "react-icons/md";
import { BsFilePerson } from "react-icons/bs";
import axios from "axios";
import { useSession} from 'next-auth/react';

const SingleComment = ({ comment, getComments }) => {
  const {data} = useSession()
  const [show, setShow] = useState(false);
  const [commentEdited, setCommentEdited] = useState(comment.content);

  const handleUpvote = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/qna/comment/${comment.id}/upvote/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Comment upvoted");
        getComments();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const upvoteUndo = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/qna/comment/${comment.id}/upvote/undo/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Comment upvote undo");
        getComments();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownvote = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/qna/comment/${comment.id}/downvote/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );
      if (response.ok) {
        console.log("Comment downvoted");
        getComments();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const downvoteUndo = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/qna/comment/${comment.id}/downvote/undo/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Comment downvote undo");
        getComments();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/qna/comment/${comment.id}/delete/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );
      if (response.ok) {
        console.log("Comment deleted");
        getComments();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleEdit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/qna/comment/${comment.id}/edit/`,
        { content: commentEdited },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );
      if (response.status === 200) {
        setShow(false);
        getComments();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDiscard = async () => {
    setShow(false);
    setCommentEdited(comment.content);
  };

  return (
    <div className={styles.singleComment}>
      <div className={styles.commentInfo}>
        <div className={styles.commentVote}>
          <BiSolidChevronUpSquare onClick={handleUpvote} />
          <span>{comment.upvotes - comment.downvotes}</span>
          <BiSolidChevronDownSquare onClick={handleDownvote} />
        </div>
        <p> {comment.content} </p>
      </div>

      <div className={styles.commentActions}>
        <MdEdit className={styles.edit} onClick={() => setShow(true)} />
        <MdDelete className={styles.delete} onClick={handleDelete} />
        <div className={styles.commentAuthor}>
          <p className={styles.author}>
            <BsFilePerson /> {comment.author.username}
          </p>
          <p className={styles.commentDate}>
            Created at {new Date(comment.date_created).toLocaleDateString()}
          </p>
        </div>
      </div>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.editContainer}>
            <label>Comment</label>
            <textarea
              value={commentEdited}
              onChange={(e) => setCommentEdited(e.target.value)}
            />
          </div>
          <div className={styles.editActions}>
            <button
              disabled={comment.content == commentEdited}
              onClick={handleEdit}
              className={`${commentEdited === comment.content ? '' : styles.commentEdit}`}
            >
              Edit
            </button>
            <button onClick={handleDiscard} className={styles.discard}>
              Discard
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SingleComment;
