import React, { useEffect, useState } from "react";
import axios from "axios";
 
import styles from "@/styles/qna/Comments.module.css";
import SingleComment from "./SingleComment";
import { useSession} from 'next-auth/react';

const AllComments = ({ answerId }) => {
  const {data} = useSession()
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [moreComments, setMoreComments] = useState(false);

  const getComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/qna/answer/${answerId}/comment/`
      );
      const data = await response.json();

      if (response.ok) {
        setAllComments(data);
        console.log("Comments fetched");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getComments();
  }, [answerId]);

  const addComment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/qna/answer/${answerId}/comment/add/`,
        { content: comment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );
      if (response.status === 200) {
        setComment("");
        console.log("Comment posted");
        getComments();
        setMoreComments(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.allComments}>
      <div className={styles.addComment}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add your comment here"
          />
          <button onClick={addComment}>Add</button>
        </div>
        {allComments.length > 0 && (
          <p
            className={styles.showToggle}
            onClick={() => setMoreComments(!moreComments)}
          >
            {moreComments ? "Hide Comments" : "Show Comments"}
          </p>
        )}
      </div>

      {
        moreComments
          ? allComments.map((com, index) => (
              <SingleComment comment={com} getComments={getComments} key={index} />
            ))
          : ""
        // allComments
        //     .slice(0, 1)
        //     .map((com, index) => <SingleComment comment={com} key={index} />)
      }
    </div>
  );
};

export default AllComments;
