import React, { useEffect, useState } from 'react';
import img from '../Assets/images/life-at-pixie-header.png';
import LifeAtPixieHeader from './Subcomponents/LifeAtPSEHeader';
import EmployeeSpeaks from './Subcomponents/EmploySpeaks';
import OurSoftwares from './Subcomponents/OurSoftwares';
import Title from './Common/Title';
import AOS from 'aos';

function LifeAtPSE() {
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
        <div className="pinnac">
            <img src={img} alt='img' />
            <section >
                <LifeAtPixieHeader />
            </section>
            {/* <section className="section-secondary-bg" title="PSE Employee Speaks">
                <Title textone={"Employee Speak"} />
                <EmployeeSpeaks />
            </section> */}
            <section className="section-secondary-bg mb-0" title="PSE Experience">
                <Title textone={"PSE Softwares"} />
                <OurSoftwares />
            </section>
        </div>
    )
}

export default LifeAtPSE