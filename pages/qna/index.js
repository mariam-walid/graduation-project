import Head from "next/head";
import styles from "@/styles/qna/Home.module.css";
import { useEffect, useState } from "react";
import Question from "@/components/qna/Question";
import AskQuestion from "@/components/qna/AskQuestion";


export default function Home() {

  const [questions, setQuestions] = useState([]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:8000/qna/question/");
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);
  if (!questions) {
    return (
      <div className={styles.loading}>
        <h1>Loading....</h1>
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>Enabled-Q&A</title>
      </Head>
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.homeAllQuestions}>All questions</h2>
            <p className={styles.qCount}> {questions.length} Questions</p>
          </div>
          <AskQuestion fetchQuestions={fetchQuestions} />
        </header>
        {questions.length === 0 ? (
          <div className={styles.noQuestions}>
            <h5>No Questions!</h5>
          </div>
        ) : (
          <div className={styles.questionsContainer}>
            <hr />
            {questions.map((question) => (
              <div key={question.id}>
                <Question question={question} fetchQuestions={fetchQuestions} />
                <hr />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
