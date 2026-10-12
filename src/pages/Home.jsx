import React from 'react'
import HeroSlider from '../components/Home/HeroSlider'
import SlideProducts from '../components/SlideProducts/SlideProducts'
import Offers from '../components/SlideProducts/Offers'
const Home = () => {
  return (
    <div>
      <HeroSlider />
      <SlideProducts />
      <Offers />
    </div>
  )
}

export default Home