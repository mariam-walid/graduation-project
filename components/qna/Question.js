import React, { useState, useEffect } from "react";
import styles from "@/styles/qna/Question.module.css";
import { BsFilePerson } from "react-icons/bs";
import { MdEdit, MdDelete } from "react-icons/md";
import Link from "next/link";
import Modal from "react-bootstrap/Modal";
 
import axios from "axios";
import {AiOutlineClose} from "react-icons/ai"
import { useSession} from 'next-auth/react';

const Question = ({ question, fetchQuestions }) => {
  const {data} = useSession()
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState(question.title);
  const [content, setContent] = useState(question.content);
  const [tags, setTags] = useState(question.tags);
  const [singleTag, setSingleTag] = useState("");
  const [maxTags, setMaxTags] = useState(false);
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
  useEffect(() => {
    fetchCurrentUser();
  }, [data]);
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/qna/question/${question.id}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );
      if (response.ok) {
        console.log("Question deleted");
        fetchQuestions();

      }
    } catch (error) {
      console.error(error);
    }
  };

  const addTag = (e) => {
    e.preventDefault();
    if (tags.length < 5) {
      setTags([...tags, singleTag]);
    } else {
      setMaxTags(true);
    }

    setSingleTag("");
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const qEdited = { title, content, tags };
    try {
      const response = await axios.post(
        `http://localhost:8000/qna/question/${question.id}/edit/`,
        qEdited,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );
      if (response.status === 200) {
        setShow(false);
        fetchQuestions();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className={styles.questionContainer}>
      <div className={styles.questionNumbers}>
        <p> {question.upvotes - question.downvotes} Votes </p>
        <p> {question.views} Views </p>
      </div>
      <div className={styles.questionInfo}>
        <Link href={`/qna/${question.id}`}>
          <p className={styles.questionTitle}>{question.title}</p>
        </Link>

        <p className={styles.questionContent}>{question.content}</p>
        <div className={styles.tagsContainer}>
          {question.tags &&
            question.tags.map((tag, index) => (
              <div className="d-flex justify-content-center align-items-center" key={index}>
                <p>{tag}</p>
              </div>
            ))}
        </div>
        <div className={styles.qFooter}>
          {question.author && (
            <div className={styles.qAuthor}>
              <BsFilePerson />
              <p>{question.author.username} </p>
            </div>
          )}

          <p className={styles.qDate}>
            {" "}
            Asked at {new Date(question.date_created).toLocaleDateString()}{" "}
          </p>
        </div>
      </div>
      <div className={styles.actions}>
        {currentUser == question.author.id && (
          <>
            <MdEdit className={styles.edit} onClick={() => setShow(true)} />
            <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
              <Modal.Header closeButton>
                <Modal.Title>Edit Question</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form className={styles.askForm}>
                  <div className={styles.inputContainer}>
                    <label>Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <label>Content</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                  <div className={styles.tags}>
                    <label>Tags</label>
                    <div>
                      <input
                        type="text"
                        placeholder="Tag..."
                        value={singleTag}
                        onChange={(e) => {
                          setSingleTag(e.target.value);
                          console.log(singleTag);
                        }}
                      />
                      <button
                        disabled={singleTag.trim().length == 0}
                        onClick={(e) => addTag(e)}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className={styles.tagContainer}>
                    {tags.map((tag, index) => (
                      <div key={index}>
                        <p>{tag}</p>
                        <AiOutlineClose
                          onClick={() => setTags(tags.filter((t) => t !== tag))}
                        />
                      </div>
                    ))}
                  </div>
                  {maxTags && <p className={styles.tagsLimit}>You can add only 5 tags</p>}
                  <div className={styles.actions}>
                    <button
                      type="submit"
                      disabled={title.trim().length == 0}
                      onClick={(e) => handleEdit(e)}
                      className={`${title.trim().length == 0 ? '' : styles.post}`}
                    >
                      Edit
                    </button>
                  </div>
                </form>
              </Modal.Body>
            </Modal>
            <MdDelete className={styles.delete} onClick={() => handleDelete()} />
          </>
        )}
        
      </div>
    </div>
  );
};

export default Question;
