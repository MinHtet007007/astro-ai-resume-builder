import React from 'react'
import Navbar from "../components/Navbar";
import Home from './Home';

const page = () => {
  return (
    <header >
      <Navbar />
      <Home/>
    </header>
  );
}

export default page