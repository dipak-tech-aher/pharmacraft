import React, { useEffect, useRef, useState } from 'react';
import AboutSectionOne from './Subcomponents/AboutSectionOne';
import OurVision from './Subcomponents/OurVision';
import WhyChooseUs from './Subcomponents/WhyChooseUs';
import Title from '../Components/Common/Title';
import img from '../Assets/images/about-header.png'
import { useLocation } from 'react-router-dom';
import AOS from 'aos';


function About() {
useEffect(() => {
  AOS.init({ delay: 200 })
}, []);
const [shouldScrollToTop, setShouldScrollToTop] = useState(true);

useEffect(() => {
    if (shouldScrollToTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setShouldScrollToTop(false);
    }
}, [shouldScrollToTop]);
  return (
    <div className="pinnac" >
      <div className="about_img_main">
        <img src={img} alt='about Img' />
      </div>
      <section title="Pinnac About Us">
        <Title textone={"About Us"} />
        <AboutSectionOne />
      </section>
      <section className="section-secondary-bg_" title="PSE Our Vision">
        <Title textone={"Our Vision"} />
        <OurVision />
      </section>
      <section className="section-secondary-bg mb-0" title="PSE Why Choose Us">
        <Title textone={"Why Choose Pharmakraft Solutions"} />
        <WhyChooseUs />
      </section>
    </div>
  )
}

export default About