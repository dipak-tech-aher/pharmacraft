import React, { useEffect, useRef, useState } from 'react'
import Title from '../Components/Common/Title';
import WhatWeDo from './Subcomponents/WhatWeDo';
import ServicesList from './Subcomponents/ServicesList';
import img from '../Assets/images/services-header.png';
import AOS from 'aos';


function Services() {
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
      <img src={img} alt='img'  />
      <section title="Pharmakraft Our Expertise">
        <Title textone={"Our Expertise"} />
        <WhatWeDo />
      </section>
      <section className="section-secondary-bg" title="PSE Our Services">
        <Title textone={"Our Services"}/>
        <ServicesList />
      </section>
    </div>
  )
}

export default Services