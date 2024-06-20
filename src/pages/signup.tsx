import React, { useState, useEffect } from "react";
import styles from "@/styles/Settings.module.scss";
import Link from "next/link";
import { signupUserManual } from "@/Utils/firebaseUser";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { push } = useRouter();
  const handleFormSubmission = async (e: any) => {
    e.preventDefault();
    if (await signupUserManual({ username, email, password })) {
      push("/settings");
    }
  };
  return (
    <div className={`${styles.settingsPage} ${styles.authPage}`}>
      <div className={styles.logo}>
        <img
          src="/images/logolmg.svg"
          alt="logo"
          data-tooltip-id="tooltip"
          data-tooltip-content="Rive"
        />
        <p>Nunca utilize a mesma Password do Email</p>
        <p>Utilize uma Password segura e unica para a App</p>
        <p>Se preferir entre pelo Login Google</p>
      </div>
      <div className={styles.settings}>
        <h1>Criar Conta</h1>
        <div className={styles.group2}>
          <>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e: any) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
            />
            <button onClick={handleFormSubmission}>submit</button>
          </>
        </div>
        <h4>
          Se ja tens uma conta faz o{" "}
          <Link href="/login" className={styles.highlight}>
            Login!
          </Link>
        </h4>
      </div>
    </div>
  );
};

export default SignupPage;
