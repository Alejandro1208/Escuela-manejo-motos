
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/home/Hero';
import CoursesSection from '../components/home/CoursesSection';
import AboutSection from '../components/home/AboutSection';
import ContactSection from '../components/home/ContactSection';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';
import ScrollToAnchor from '../components/ScrollToAnchor'; 

const HomePage: React.FC = () => {
  return (
    <div className="relative bg-white dark:bg-gray-900">
      <ScrollToAnchor />
      <Header />
      <main>
        <Hero />
        <CoursesSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default HomePage;
