import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import CreateCDPForm from './components/Create';

function App() {
  return (
    <div className="App">
      <Navbar />
      <CreateCDPForm />
    </div>
  );
}

export default App;
