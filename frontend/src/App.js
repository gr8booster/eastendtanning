import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';
import Home from './pages/Home';
import Tanning from './pages/Tanning';
import Laundry from './pages/Laundry';
import Drinks from './pages/Drinks';
import Nails from './pages/Nails';
import Locations from './pages/Locations';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tanning" element={<Tanning />} />
            <Route path="/laundry" element={<Laundry />} />
            <Route path="/drinks" element={<Drinks />} />
            <Route path="/nails" element={<Nails />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;