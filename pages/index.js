import Card from "react-bootstrap/Card";
import styles from "@/styles/home.module.css";
import Image from "next/image";

const cards = [
  {
    id: 1,
    image: "/qna.png",
    title: "Qna",
    text: "Your go-to app for accessing a community of experts, where you can ask questions and gain valuable insights",
  },
  {
    id: 2,
    image: "/assignment.png",
    title: "Assignments",
    text: "The ultimate tool to streamline your academic journey and stay organized. Manage assignments, deadlines.",
  },
  {
    id: 3,
    image: "/pulse.png",
    title: "Time Tracker",
    text: "Pulse: time tracking App track and analyze your performance , Get real-time insights and measures the pulse of your activities and project progress in an interactive and customizable reports and dashboards",
  },
];

export default function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.info}>
        <div className={styles.title}>
          <p>Enabledu</p>
          <p>Graduation Project</p>
        </div>
        <div className={styles.moreInfo}>
          <p>
            Enhancing Learning Experiences with an Innovative Learning
            Management System
          </p>
        </div>
      </div>
      <div className={styles.cardsContainer}>
        {cards.map((card) => (
          <div key={card.id} className={styles.card}>
            <Image src={card.image} width={350} height={250} />
            <div className={styles.cardInfo}>
              <h5 className={styles.cardTitle}>{card.title}</h5>
              <p className={styles.cardText}>{card.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
