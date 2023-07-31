import React, { useState } from "react";
import styles from '@/styles/register.module.css'
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import {signIn} from 'next-auth/react'


const Login = () => {

    const router = useRouter()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [wrong, setWrong] = useState(false);
  
    const transformedEmail = encodeURIComponent(email);

    const submit = async (e) => {
      e.preventDefault();
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
        setWrong(true)
      }

          // try{
          //     const response = await axios.post('http://localhost:8000/auth/jwt/login',
          //     `username=${transformedEmail}&password=${password}`,
          //     {
          //       headers: {
          //         "Content-Type": "application/x-www-form-urlencoded",
          //       },
          //     })
          //     const data =await  response.data;
          //     if(response.status===200){
          //       console.log('Login successfully', data)
          //       // window.localStorage.setItem('accessToken',response.data.access_token)
          //       saveToStorage('accessToken',data.access_token)
          //       router.push('/')
          //     }
          // }catch (err){
          //     setWrong(true)
          //     console.log(err)
          // }
    };
  
  
    return (
     <div className={styles.main}>
        <div className={styles.login}>
          <h5>Welcome back!</h5>
          <p>We are so excited to see you again!</p>
          <form onSubmit={submit}>
          <div className={styles.inputContainer}>
            {wrong && <p className={styles.error}> Wrong email or password!</p>}
          <label htmlFor="email">EMAIL</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
              <button type="submit">Log in</button>
              <p>Need an account? <Link href='/register'>Register</Link></p>

          </form>
        </div>
      </div>
    );
}

export default Login
