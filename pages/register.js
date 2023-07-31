import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import styles from "@/styles/register.module.css";
import { useRouter } from "next/router";
import {signIn} from 'next-auth/react'

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState(0);
  const [userExist, setUserExist] = useState(false);

  const [accept, setAccept] = useState(false);
  const transformedEmail = encodeURIComponent(email);

  const submit = async (e) => {
    e.preventDefault();
    setAccept(true);
    if (username !== "" && age !== null) {
      try {
        const registerResponse = await fetch(
          "http://localhost:8000/auth/register/",
          {
            method: "POST",
            body: JSON.stringify({
              email,
              password,
              username,
              age,
              is_active: true,
              is_superuser: false,
              is_verified: false,
              first_name: "string",
              last_name: "string",
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (registerResponse.ok) {
          const result = await signIn('credentials',{
            email: transformedEmail,
            password: password,
            redirect: false,
          })
          console.log('res',result)
          if (result && !result.error){
            router.push('/')
          }else{
            console.log('Error', result);
          }
        } else {
          console.error("Registration failed");
          setUserExist(true);
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setUserExist(true);
      }
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.register}>
        <h5>Create an account</h5>
        <form onSubmit={submit}>
          <div className={styles.inputContainer}>
            <label htmlFor="email">EMAIL</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {userExist && <p className={styles.error}>User already exists!</p>}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="username">USERNAME</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {username === "" && accept && (
              <p className={styles.error}>Username is required</p>
            )}
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="password">PASSWORD</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="age">AGE</label>
            <input
              id="age"
              type="text"
              // value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            {age === null && accept && (
              <p className={styles.error}>Please enter your age</p>
            )}
          </div>

          <button type="submit">Continue</button>

          <Link href="/login">Already have an account?</Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
