// components/login.tsx
// import axios, { AxiosResponse, AxiosError } from 'axios';
import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { LoginResponse } from 'api/proto-http/auth';
import { login } from 'api';
import { ROUTES } from 'constants/routes';
import { useNavigate} from '@tanstack/react-location';
import styles from 'styles/login-block.module.scss';


export const LoginBlock: FC = () => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      // Redirect to main screen if authToken exists
      navigate({ to: ROUTES.main, replace: true });
    }
  }, [navigate]);

  
  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!username || !password) {
        throw new Error('empty fields');
      }

      //request to server 
      const response: LoginResponse = await login(username, password);

      if (!response.authToken) {
        // if the token was not receivedif
        setErrorMessage('token not received');
        return;
      }

      const authToken = response.authToken;

      localStorage.setItem('authToken', authToken);

      navigate({ to: ROUTES.main, replace: true });

    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('wrong login or password');
        } else if (error.response.status >= 500) {
          setErrorMessage('server is not available');
        } else {
          setErrorMessage('error');
        }
      } else {
        setErrorMessage('error');
      }
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <div className={styles.loginBlock}>
      <h4 className={styles.card_header}>Login</h4>
      <div className="card_body">
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <form className={styles.form} onSubmit={handlePasswordSubmit}>
          <div className={styles.user_container}>
            <label className={styles.user_data} htmlFor="username">Username</label>
            <input onChange={handleUsernameChange} type='text' name='username' />
          </div>
          <div className={styles.user_container}>
            <label className={styles.user_data} htmlFor="password">Password</label>
            <input className={styles.input} onChange={handlePasswordChange} type='password' name='password' />
          </div>
          <button type='submit'>Login</button>
        </form>
      </div>
    </div>
  );
};
