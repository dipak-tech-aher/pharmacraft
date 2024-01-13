import {Link, useNavigate} from 'react-router-dom';
import img from '../../Assets/images/about-rectangle.png';
import AOS from 'aos'
import { useEffect } from 'react';
export default function HomeAbout() {
    useEffect(() => {
        AOS.init({ delay: 300 })
      }, []);

    const navigate = useNavigate();
    const handleNavigate = () =>{
        navigate("/about",{state:{ pageNo:2}})
    }
    
    return (
        <div className="home-about-section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12" data-aos="zoom-out-right" data-aos-easing="linear" data-aos-duration="600">
                        <div className="about-left-img">
                            <img src={img} alt='About'/>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12" data-aos="zoom-out-left" data-aos-easing="linear" data-aos-duration="600">
                        <div className="about-right-title">
                            Designing the Backbone of Industry
                        </div>
                        <div className="about-right-content">
                            we offer a wide range of designing services, including fixture
                            design, press tool design, forging design, structural design,
                            mold design, product design, packaging design and other
                            designing services. Our team of experienced designers and
                            engineers are equipped with the latest tools and technologies
                            to help you create innovative and cost-effective designs that
                            meet our business requirements.
                        </div>
                        <div className="about-right-button">
                            <span onClick={handleNavigate}>Detail</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}