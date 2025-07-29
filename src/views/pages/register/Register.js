// import React, { useState } from 'react';
// //import { useHistory } from 'react-router-dom';
// import { Link, useNavigate } from 'react-router-dom'; 
// import axios from 'axios';

// const Register = () => {
//  // const history = useHistory();
//  const navigateTo = useNavigate();
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [repeatpassword, setRepeatPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const handleRegister = async () => {
//     try {
//       const response = await axios.post('http://54.205.149.77:8132/api/auths/register', { username, email, password, repeatpassword });
//       setMessage(response.data.message);
//       if (response.status === 200) {
//        // history.push('/login');
//        navigateTo('/login');
//       }
//     } catch (error) {
//       setMessage("Registration failed");
//     }
//   };

//   return (
//     <div className="container">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card">
//             <h5 className="card-header">Register</h5>
//             <div className="card-body">
//               <div className="mb-3">
//                 <label className="form-label">Username:</label>
//                 <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="form-control" />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Email:</label>
//                 <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Password:</label>
//                 <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Repeat Password:</label>
//                 <input type="password" value={repeatpassword} onChange={e => setRepeatPassword(e.target.value)} className="form-control" />
//               </div>
//               <button onClick={handleRegister} className="btn btn-info" >Register</button>
//               <p>{message}</p>
//               <Link to="/login" className="btn btn-link">Login</Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;