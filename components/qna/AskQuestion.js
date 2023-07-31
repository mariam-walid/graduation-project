import React, { useState } from "react";
import styles from "@/styles/qna/AskQuestion.module.css";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
 
import { GrAdd, GrFormClose } from "react-icons/gr";
import {AiOutlineClose} from "react-icons/ai"
import { useSession} from 'next-auth/react';

const AskQuestion = ({ fetchQuestions }) => {
  const {data} = useSession()
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [singleTag, setSingleTag] = useState("");
  const [show, setShow] = useState(false);
  const [maxTags, setMaxTags] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const question = {
      title,
      content,
      tags,
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/qna/question/add/",
        question,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        setTitle("");
        setContent("");
        setTags([]);
        handleClose();
        fetchQuestions();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleDiscard = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setSingleTag("");
    setShow(false);
    setMaxTags(false)
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
  return (
    <div>
      <button onClick={handleShow} className={styles.askQuestion}>
        Ask Question
      </button>
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Ask Question</Modal.Title>
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
                onClick={(e) => handleSubmit(e)}
                className={`${title.trim().length == 0 ? '' : styles.post}`}
              >
                Post
              </button>
              <button onClick={handleDiscard} className={styles.discard}>Discard</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AskQuestion;
