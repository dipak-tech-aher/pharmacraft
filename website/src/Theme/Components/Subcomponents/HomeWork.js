import { Link, useNavigate } from 'react-router-dom';
import imgOne from '../../Assets/design/RFC1.jpg'
import imgTwo from '../../Assets/design/CF3.1.jpg';
import three from '../../Assets/design/mold4.1.jpg'

import * as Bs from 'react-icons/bs'

export default function HomeWork() {
    const navigate = useNavigate();
    const handleWorkRouting = (val) =>{
        navigate('/work', { state: { no: val } });
    }
    return (
        <div className='work-inner-page-container'>
            <div className="container">

                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12" data-aos="zoom-out-down" data-aos-easing="linear" data-aos-duration="600">
                        <div className="our-work-header text-center">
                            Explore Our Portfolio.
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12" data-aos="zoom-out-down" data-aos-easing="linear" data-aos-duration="600">
                        <div className="our-work-header text-center">
                            See What We've Accomplished.
                        </div>
                    </div>
                </div>


                <div className="work-button-container">
                    <div className="work-button align-item-center d-flex justify-content-center" data-aos="zoom-out-left" data-aos-easing="linear" data-aos-duration="600">
                        <div className='buttons_mobileview'>
                            <button>FIXTURE DESIGN</button>
                            <button  onClick={() =>handleWorkRouting(2)}>PRESS TOOL DESIGN</button>
                            <button  onClick={() =>handleWorkRouting(3)}>FORGING TOOL DESIGN</button>
                            {/* <button  onClick={() =>handleWorkRouting(4)}>PRODUCT DESIGN</button> */}
                            <button  onClick={() =>handleWorkRouting(4)}>MOLD DESIGN</button>
                            <button  onClick={() =>handleWorkRouting(5)}>PACKAGING DESIGN</button>
                            <button  onClick={() =>handleWorkRouting(6)}>OTHERS</button>

                        </div>


                    </div>
                </div>
                <div className="border-bottom-work my-2" data-aos="zoom-out-left" data-aos-easing="linear" data-aos-duration="600">
                    <div className="border-inside-border"></div>
                </div>

                <div className="projects-section">
                    <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                        <div className="project" >
                            <img className="workimage" src={imgOne} />
                        </div>
                    </div>
                    <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                        <div className="project" >
                            <img className="workimage" src={imgTwo} />
                        </div>
                    </div>
                    <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                        <div className="project" >
                            <img className="workimage" src={three} />
                        </div>
                    </div>
                    <div className="clear"></div>
                </div>
                <div className="view-our-work-button">
                    <Link to="/work">View our work <Bs.BsArrowRight /></Link>
                </div>

            </div>
        </div>
    )
}