// components/login.tsx
// import axios, { AxiosResponse, AxiosError } from 'axios';
import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { LoginResponse } from '/home/oak/Desktop/grbpwr/grbpwr-admin-client/src/api/proto-http/auth';
// import { useMutation } from '@tanstack/react-query';
// import { MUTATIONS } from 'api';
import { login } from 'api';
import { ROUTES } from 'constants/routes';
import { useNavigate} from '@tanstack/react-location';
import styles from 'styles/login-block.module.scss';

// interface LoginResponse {
//   authToken: string;
// }

export enum MUTATIONS {
  login = 'login',
}

// copy of type inside generated file (no export, need to define explicitly)
type RequestType = {
  path: string;
  method: string;
  body: string | null;
};


const getAuthHeaders = (authToken: string) => ({
  'Grpc-Metadata-Authorization': `Bearer ${authToken}`,
});

// export function login(password: string,username: string): Promise<LoginResponse> {
//   const authClient = createAuthClient(({ path, body }: RequestType): Promise<LoginResponse> => {
//     return axios
//       .post<LoginRequest, AxiosResponse<LoginResponse>>(path, body && JSON.parse(body))
//       .then((response) => response.data);
//   });

//   return authClient.Login({ 
//     username: username,
//     password: password,
//   });
// }

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

    try {
      if (!username || !password) {
        throw new Error('Пожалуйста, заполните все поля');
      }

      // Вызываем функцию login, которая отправляет запрос на сервер
      const response: LoginResponse = await login(username, password);

      if (!response.authToken) {
        // Обработка случая, если токен не был получен
        setErrorMessage('Токен не получен');
        return;
      }

      const authToken = response.authToken;

      localStorage.setItem('authToken', authToken);

      navigate({ to: ROUTES.main, replace: true });
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Неверное имя пользователя или пароль');
        } else if (error.response.status >= 500) {
          setErrorMessage('Сервер недоступен');
        } else {
          setErrorMessage('Произошла ошибка');
        }
      } else {
        setErrorMessage('Произошла ошибка');
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
