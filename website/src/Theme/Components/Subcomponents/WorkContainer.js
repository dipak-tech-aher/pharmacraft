import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Bs from 'react-icons/bs'
import CF1 from "../../Assets/design/CF1.1.jpg";
import CF2 from "../../Assets/design/CF2.1.jpg";
import CF3 from "../../Assets/design/CF3.1.jpg"
import PT1 from "../../Assets/design/PT1.jpg";
import PT2 from "../../Assets/design/PT2.jpg";
import PT3 from "../../Assets/design/PT3.jpg";
import PT4 from "../../Assets/design/PT4.jpg";
import PT5 from "../../Assets/design/PT5.jpg"
import PT6 from "../../Assets/design/PT6.jpg"
import PT7 from "../../Assets/design/PT7.jpg"
import PT8 from "../../Assets/design/PT8.jpg"

import FD1 from "../../Assets/design/FD1.PNG";
import FD2 from "../../Assets/design/FD2.PNG";
import FD3 from "../../Assets/design/FD3.PNG";
import FD4 from "../../Assets/design/FD4.PNG";
import FD5 from "../../Assets/design/FD5.PNG"
import FD6 from "../../Assets/design/FD6.PNG"
import FD7 from "../../Assets/design/FD7.PNG"

import MD1 from "../../Assets/design/mold1.1.jpg";
import MD2 from "../../Assets/design/mold2.1.jpg";
import MD3 from "../../Assets/design/mold3.1.jpg";
import MD4 from "../../Assets/design/mold4.1.jpg";

import pac1 from "../../Assets/design/pac1.jpeg";
import pac2 from "../../Assets/design/pac2.jpeg";
import pac3 from "../../Assets/design/pac3.jpeg";
import pac4 from "../../Assets/design/pac4.jpeg";
import pac5 from "../../Assets/design/pac5.jpeg"
import pac6 from "../../Assets/design/pac6.jpeg"
import pac7 from "../../Assets/design/pac7.jpeg"
import pac8 from "../../Assets/design/pac8.jpeg"
import pac9 from "../../Assets/design/pac9.jpeg"

import other1 from "../../Assets/design/RFC1.jpg";
import other2 from "../../Assets/design/RFC2.jpg";
import other3 from "../../Assets/design/SWF1.jpg";
import other4 from "../../Assets/design/SWF2.jpg";
import other5 from "../../Assets/design/structural1.1.jpg"



export default function WorkContainer(props) {
    const location = useLocation();
    const { no } = location.state || {};
    const [showWork, setShowWork] = useState(no ? no : 1);
    const showTabRef = useRef(null);

    useEffect(() => {
        if (showTabRef.current && showWork !== null) {
          const activeButton = showTabRef.current.querySelector(`[data-index="${showWork}"]`);
          if (activeButton) {
            const containerWidth = showTabRef.current.clientWidth;
            const activeButtonWidth = activeButton.offsetWidth;
            const activeButtonLeft = activeButton.offsetLeft;
            const scrollLeft = activeButtonLeft - (containerWidth - activeButtonWidth) / 2;
            showTabRef.current.scrollLeft = scrollLeft;
          }
        }
      }, [showWork]);
    
      const handleClick = (index) => {
        setShowWork(index);
      };
    return (
        <div className='work-inner-page-container'>
            <div className="container">

                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12" data-aos="zoom-out-down" data-aos-easing="linear" data-aos-duration="600">
                        <div className="our-work-header text-center">
                            Explore Our Portfolio
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12" data-aos="zoom-out-down" data-aos-easing="linear" data-aos-duration="600">
                        <div className="our-work-header text-center">
                            See What We've Accomplished.
                        </div>
                    </div>
                </div>

                <div className="work-button-container" >
                    <div className="work-button nav-pills align-item-center d-flex justify-content-center" data-aos="zoom-out-left" data-aos-easing="linear" data-aos-duration="600"
                        id="pills-tab" role="tablist" >
                        <div className='buttons_mobileview' ref={showTabRef}>
                            <button  data-index={1}  className={`workBtn ${showWork === 1 ? "active" : ''}`} id="pills-0-tab" data-bs-toggle="pill" data-bs-target="#pills-0" type="button" role="tab" aria-controls="pills-0" aria-selected="true" onClick={() => handleClick(1)}> FIXTURE DESIGN</button>
                            <button  data-index={2}  className={`workBtn ${showWork === 2 ? "active" : ''}`} id="pills-1-tab" data-bs-toggle="pill" data-bs-target="#pills-1" type="button" role="tab" aria-controls="pills-1" aria-selected="false" onClick={() => handleClick(2)}>   PRESS TOOL DESIGN</button>
                            <button  data-index={3}  className={`workBtn ${showWork === 3 ? "active" : ''}`} id="pills-2-tab" data-bs-toggle="pill" data-bs-target="#pills-2" type="button" role="tab" aria-controls="pills-2" aria-selected="false" onClick={() => handleClick(3)}>   FORGING TOOL DESIGN</button>
                            <button  data-index={4}  className={`workBtn ${showWork === 4 ? "active" : ''}`} id="pills-4-tab" data-bs-toggle="pill" data-bs-target="#pills-4" type="button" role="tab" aria-controls="pills-4" aria-selected="false" onClick={() => handleClick(4)}>MOLD DESIGN</button>
                            <button  data-index={5}  className={`workBtn ${showWork === 5 ? "active" : ''}`} id="pills-4-tab" data-bs-toggle="pill" data-bs-target="#pills-4" type="button" role="tab" aria-controls="pills-4" aria-selected="false" onClick={() => handleClick(5)}>PACKAGING DESIGN</button>
                            <button  data-index={6}  className={`workBtn ${showWork === 6 ? "active" : ''}`} id="pills-4-tab" data-bs-toggle="pill" data-bs-target="#pills-4" type="button" role="tab" aria-controls="pills-4" aria-selected="false" onClick={() => handleClick(6)}>OTHERS</button>
                        </div>
                    </div>
                </div>
                <div className="border-bottom-work my-2" data-aos="zoom-out-left" data-aos-easing="linear" data-aos-duration="600">
                    <div className="border-inside-border"></div>
                </div>

                <div className="projects-section tab-content" id="pills-tabContent" >
                    {showWork === 1 &&
                        <div className="projects-section">
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={CF1} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={CF2} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={CF3} />
                                </div>
                            </div>
                            <div className="clear"></div>
                        </div>
                    }
                    {showWork === 2 &&
                        <div className="projects-section">
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={PT1} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={PT2} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={PT3} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={PT4} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={PT5} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={PT6} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={PT7} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={PT8} />
                                </div>
                            </div>
                            <div className="clear"></div>
                        </div>
                    }
                    {showWork === 3 &&
                        <div className="projects-section">
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={FD1} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={FD2} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={FD3} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={FD4} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={FD5} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={FD6} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={FD7} />
                                </div>
                            </div>
                            <div className="clear"></div>
                        </div>
                    }
                    {showWork === 4 &&
                        <div className="projects-section">
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={MD1} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={MD2} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={MD3} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={MD4} />
                                </div>
                            </div>
                            <div className="clear"></div>
                        </div>
                    }
                    {showWork === 5 &&
                        <div className="projects-section">
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={pac1} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={pac2} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={pac3} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={pac4} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={pac5} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={pac6} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={pac7} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={pac8} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={pac9} />
                                </div>
                            </div>
                            <div className="clear"></div>
                        </div>
                    }
                    {showWork === 6 &&
                        <div className="projects-section">
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={other1} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={other2} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={other3} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={other4} />
                                </div>
                            </div>
                            <div data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                                <div className="project" >
                                    <img className="workimage" alt="WorkImg" src={other5} />
                                </div>
                            </div>
                            <div className="clear"></div>
                        </div>
                    }
                    <div className="clear"></div>
                </div>
                {
                    props.page === "home" &&
                    <div className="view-our-work-button">
                        <Link href="/work">View our work <Bs.BsArrowRight /></Link>
                    </div>
                }
            </div>
        </div>
    )
}