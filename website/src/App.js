import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

// import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './Theme/Components/Home';
import About from './Theme/Components/About';
import Services from './Theme/Components/Services';
import Work from './Theme/Components/Work';
import ContactUs from './Theme/Components/ContactUs';
import "../src/Theme/styles/globals.css"
import "../src/Theme/styles/Home.module.css"
import "../src/Theme/styles/responsive.css";
import "../src/Theme/styles/testimonial.css";
import Header from './Theme/Components/Common/Header';
import Footer from './Theme/Components/Common/Footer';
import LifeAtPSE from './Theme/Components/LifeAtPSE';



function App() {
  return (
    <div className="app">
      <HashRouter>
        <Header />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/about' element={<About />} />
          <Route exact path='/service' element={<Services />} />
          <Route exact path='/work' element={<Work />} />
          <Route exact path='/lifeAtPSE' element={<LifeAtPSE />} />
          <Route exact path='/contact' element={<ContactUs />} />
        </Routes>
        <Footer />
      </HashRouter>
    </div>
  );
}

export default App;
