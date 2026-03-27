import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Products from './components/Products'
import Technology from './components/Technology'
import Cases from './components/Cases'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <About />
      <Products />
      <Technology />
      <Cases />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
