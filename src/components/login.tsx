// components/login.tsx
import { FC, useState, ChangeEvent, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login } from 'api';
import { ROUTES } from 'constants/routes';
import axios from 'axios';
import styles from 'styles/login-block.module.scss';

interface LoginResponse {
  authToken: string;
}

export const LoginBlock: FC = () => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // Use the login function from the api
  const { mutate } = useMutation<LoginResponse, any, { username: string, password: string }>(['login', login]);

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requestData = {
      username: username,
      password: password,
    };

  //   try {
  //     const response = await axios.post('http://backend.grbpwr.com/auth/login', requestData);
  //     console.log('Login response:', response.data);
  //     // Handle the response data here
  //   } catch (error) {
  //     console.error('Error:', error);
  //     // Handle error
  //   }
  // };

  try {
    const response = await fetch('http://backend.grbpwr.com:8081/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

   
    if (response.ok) {
      alert(JSON.stringify(response))
      // Do something with the successful response
    } else {
      // Handle error cases
    }
  } catch (error) {
    // Handle network or other errors
  }
}



  const handleAdditionalRequest = () => {
    axios.get('http://164.90.186.151:8081')
      .then(response => {
        // Handle the response as needed
        console.log('Response from additional request:', response.data);
      })
      .catch(error => {
        console.error('Error making additional request:', error);
      });
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <div className={styles.LoginBlock}>
      <h4 className='card_header'>Login</h4>
      <div className="card_body">
        <form onSubmit={handlePasswordSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input onChange={handleUsernameChange} type='text' name='username' />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input className={styles.input} onChange={handlePasswordChange} type='password' name='password' />
            <button type='button' onClick={handleAdditionalRequest}>Make Additional Request</button>
          </div>
          <button type='submit'>Login</button>
        </form>
      </div>
    </div>
  );
};
