import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Components/Header';
import HomePage from './Pages/HomePage';
import CoinsPage from './Pages/CoinsPage';
import { Box } from '@mui/system';
import AlertNotification from './Components/AlertNotification';

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ bgcolor: '#14161a', color:'white', minHeight: '100vh' }}>
        <Header></Header>
        <Routes>
          <Route path='/' element={<HomePage/>} exact/>
          <Route path='/coins/:id' element={<CoinsPage/>} />
        </Routes>
      </Box>
      <AlertNotification></AlertNotification>
    </BrowserRouter>
  );
}

export default App; 