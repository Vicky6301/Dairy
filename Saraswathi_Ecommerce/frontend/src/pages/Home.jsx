import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import DairyHeroBanner from '../components/DairyHeroBanner'

import AboutUs from "../components/AboutUs";
import PopularCategories from "../components/PopularCategories";
import TestimonialSection from '../components/TestimonialSection'

const Home = () => {
  return (
    <div>
      <Hero/>
      <PopularCategories />
      <AboutUs/>
      <LatestCollection/>
      <BestSeller/>
      <DairyHeroBanner/>
      <TestimonialSection />
    </div>
  )
}

export default Home
