// components/login.tsx
import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import { login } from 'api';
import { ROUTES } from 'constants/routes';
import { useNavigate} from '@tanstack/react-location';
import styles from 'styles/login-block.module.scss';

interface LoginResponse {
  authToken: string;
}

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

  // function unathorizedError() {
  //   localStorage.removeItem('authToken');
  //   navigate({to: ROUTES.login, replace: true})
  // }

  // Use the login function from the api
  // const { mutate } = useMutation<LoginResponse, any, { username: string, password: string }>(['login', login]);

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requestData = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch('http://backend.grbpwr.com:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        // if the response status is not in the 200-299 range, throw an error
        if (response.status === 401) {
          // unathorizedError();
          alert('ERROR');
        } else if (response.status >= 500) {
          setErrorMessage('server is down');
        } else if (response.status >= 400 && response.status < 500) {
          setErrorMessage('incorrect password');
        }
        return;
      }

      // Convert the response to JSON and print it
      const jsonResponse = await response.json();
      const authToken = jsonResponse.authToken;

      localStorage.setItem('authToken', authToken);

      navigate({to: ROUTES.main, replace: true});

    } catch (error) {
      // Handle network or other errors
      setPassword('')
    }
  }

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
