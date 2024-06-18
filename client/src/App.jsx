import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import UpdateUser from './pages/UpdateUser';
import Home from './pages/Home';
import Header from './pages/Header';
import { Toaster } from './components/ui/toaster';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/sign-up' element={<SignUp />}/>
        <Route path='/sign-in' element={<SignIn />}/>
        <Route path='/update-User' element={<UpdateUser />}/>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
