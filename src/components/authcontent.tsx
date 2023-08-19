// import { createContext, useContext, useState, ReactNode } from 'react';

// interface AuthContextType {
//   isAuthenticated: boolean;
//   login: () => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function useAuth(): AuthContextType {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

//   const login = (): void => {
//     // Call your authentication API here and handle successful login
//     // Set isAuthenticated to true if authentication is successful
//     setIsAuthenticated(true);
//   };

//   const logout = (): void => {
//     // Handle logout logic here
//     // Set isAuthenticated to false
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
