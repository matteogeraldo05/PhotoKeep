import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Reviews from './pages/Reviews'
import FAQ from './pages/FAQ'
import Pricing from './pages/Pricing'
import Contact from './pages/Contact'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section id="home"><Home /></section>
        <section id="about"><About /></section>
        <section id="services"><Services /></section>
        <section id="reviews"><Reviews /></section>
        <section id="faq"><FAQ /></section>
        <section id="pricing"><Pricing /></section>
        <section id="contact"><Contact /></section>
      </main>
      <Footer />
    </div>
  )
}
