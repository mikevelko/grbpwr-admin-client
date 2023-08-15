import { FC, useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from 'api';
import { ROUTES } from 'constants/routes';

import styles from 'styles/login-block.module.scss';


export const LoginBlock: FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setModalVisability] = useState(false);
  const [password, setPassword] = useState('');
  const { mutate, data } = useMutation(login);

  useEffect(() => {
    if (data?.authToken) {
      localStorage.setItem('authToken', data.authToken);
    }
  }, [data?.authToken]);

  const toggleModal = () => {
    setModalVisability((v) => !v);
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await mutate(password, {
        onSuccess: (data) => {
          if (data.authToken) {
            localStorage.setItem('authToken', data.authToken);
            // Redirect to the main page
            location.href = ROUTES.main;
          }
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error, e.g., display an error message to the user
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div>
      {/* <button onClick={toggleModal}>Login</button> */}
      {/* {isModalOpen && ( */}
        <>
          {/* <div className={styles.loginModal}> */}
            <h4 className='card_header'>login</h4>
            <div className="card_body">
              <form onSubmit={handlePasswordSubmit}>
                <div>
                  <label htmlFor="pswrd">Password</label>
                  <input onChange={handlePasswordChange} type='password' name='pswrd' />
                </div>
                <button type='submit'>login</button>
              </form>
            </div>
          {/* </div> */}
        </>
      {/* )} */}
    </div>
  );
};
