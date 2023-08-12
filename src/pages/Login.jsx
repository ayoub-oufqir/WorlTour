import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Login() {
  const {login, isAuthenticated} = useAuthContext();
  console.log(isAuthenticated)
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");

  const navigate = useNavigate();

  useEffect(() => {
    //navigate user to the app when he is authenticated
    // replavce: true makes the navigation to /app erease the current path from the history stack which is /login
    if(isAuthenticated===true) navigate("/app", {replace:true});
  }, [isAuthenticated, navigate])

  function handleLogin(e){
    e.preventDefault();
    if(email && password) login(email, password);
  }
  return (
    <main className={styles.login}>
    <PageNav />
      <form className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button onClick={(e)=>handleLogin(e)} type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
