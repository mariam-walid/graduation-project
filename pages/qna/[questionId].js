import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import axios from "axios";
 
import {
  BiSolidChevronUpSquare,
  BiSolidChevronDownSquare,
  BiSolidChevronsLeft,
} from "react-icons/bi";
import styles from "@/styles/qna/QuestionDetails.module.css";
import Answer from "@/components/qna/Answer";
import { useSession} from 'next-auth/react';

const QuestionDetails = () => {
  const {data} = useSession()
  const router = useRouter();
  const questionId = router.query.questionId;
  const [details, setDetails] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState(null)
  const [answer, setAnswer] = useState("");
  const [vote, setVote] = useState(null)

  
  const fetchDetails = async () => {
    if (questionId) {
      try {
        const response = await fetch(
          `http://localhost:8000/qna/question/${questionId}/`
        );
        const data = await response.json();
        setDetails(data);
        console.log('fetch details')
      } catch (error) {
        console.error(error);
      }
    }
  };
  
  const fetchAnswers = async () => {
    if (questionId) {
      try {
        const response = await fetch(
          `http://localhost:8000/qna/question/${questionId}/answer/`
        );
        const data = await response.json();
        setQuestionAnswers(data);
      } catch (error) {
        console.error(error);
      }
    }
  }
  useEffect(() => {
    fetchDetails();
    fetchAnswers();
  },[questionId]);

  const postAnswer = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/qna/question/${questionId}/answer/add/`,
        { content: answer },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.user.access_token}`,
          },
        }
      );

      if (response.status === 200) {
        setAnswer('')
        console.log("Answer posted");
        fetchAnswers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const questionVote = async () => {
    if(vote){
      try {
        const response = await fetch(
          `http://localhost:8000/qna/question/${questionId}/${vote}/`,
  
          {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.user.access_token}`,
            },
          }
        );
  
        if (response.ok) {
          console.log("Question "+ vote);
          fetchDetails();
        }
      } catch (error) {
        console.error(error);
      }
    }
    
  }
  useEffect(()=>{
    questionVote();
  },[vote])
  
  if (!details) {
    return (
      <div>
        <h1>Loading....</h1>
      </div>
    );
    
  }
  return (
    <>
    <main className={styles.main}>
      
      <header className={styles.header}>
        <div className={styles.allQ} onClick={() => router.back()}>
          <BiSolidChevronsLeft /> 
          <span>All questions</span>
        </div>
      </header>

      <div className={styles.container}>
      <div className={styles.qHeader}>
        <p> {details.title} </p>
      </div>
        <hr/>
      <div className={styles.qBody}>
        <div className={styles.qVote }>
          <BiSolidChevronUpSquare onClick={()=>setVote('upvote')} className={`${styles.qSvg} ${vote=='upvote' ? styles.vote : ''}`}/>
          <span> {details.upvotes - details.downvotes} </span>
          <BiSolidChevronDownSquare onClick={()=>setVote('downvote')} className={`${styles.qSvg} ${vote=='downvote' ? styles.vote : ''}`} />
        </div>

          <p> {details.content} </p>
        </div>
        <hr/>
        <div className={styles.qAnswer}>
          <h4>Your Answer</h4>
          <div>
          <input
            type="text"
            placeholder="Enter your answer here"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button onClick={postAnswer}> Post your answer </button>
          </div>
          <hr/>
        </div>
        <div className={styles.answersContainer}>
          <h3> Answers </h3>
          <div>
          {
            questionAnswers && <>
            {questionAnswers.map((answer) => (
              <Answer key={answer.id} answer={answer} fetchAnswers={fetchAnswers} questionAuthor={ details.author.id} />
          ))}</>
          }
          </div>
        </div>
      </div>
    </main></>
  );
};

export default QuestionDetails;
