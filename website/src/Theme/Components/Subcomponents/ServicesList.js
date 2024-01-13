
import * as TFi from "react-icons/tfi";
import * as bs from "react-icons/bs"
import * as gi from "react-icons/gi"
import * as fi from "react-icons/fi";
import * as tb from "react-icons/tb";
import { useEffect } from "react";
import AOS from 'aos'

export default function ServicesList() {
    useEffect(() => {
        AOS.init({ delay: 300 })
    }, []);
    return (
        <div>
            <div className="container">
                <div className="row">

                    <div className="service   col-sm-12 col-md-6 col-lg-4 service__one" data-aos="zoom-out-right" data-aos-easing="linear" data-aos-duration="600" style={{ backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
                        <div className="service-box"  >
                            <div className="service-img">
                                <bs.BsFillGearFill />
                            </div>
                            <div className="service-title">
                                FIXTURE DESIGN
                            </div>
                            <div className="service-content">
                                <li> Machining Fixtures </li>
                                <li>  Welding Fixtures </li>
                                <li>  Assembly Fixtures </li>
                                <li>  Checking Fixtures </li>

                            </div>
                        </div>
                    </div>

                    <div className="service  col-sm-12 col-md-6 col-lg-4 service__two" data-aos="zoom-out-right" data-aos-easing="linear" data-aos-duration="600" style={{ backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
                        <div className="service-box">
                            <div className="service-img">
                                <gi.GiGears />
                            </div>
                            <div className="service-title">
                                PRESS TOOL DESIGN
                            </div>
                            <div className="service-content">
                                <li>Blanking tool. </li>
                                <li>Parting off tool. </li>
                                <li> Forming tool</li>
                                <li> Piercing tool.</li>
                                <li> Trimming tool.</li>
                            </div>
                        </div>
                    </div>

                    <div className="service  col-sm-12 col-md-6 col-lg-4 service__three" data-aos="zoom-out-right" data-aos-easing="linear" data-aos-duration="600" style={{ backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }} >
                        <div className="service-box">
                            <div className="service-img">
                                <gi.GiMechanicalArm />
                            </div>
                            <div className="service-title">
                                PRESS TOOL DESIGN
                            </div>
                            <div className="service-content">
                                <li>Drawing tool. </li>
                                <li>Cut off tool. </li>
                                <li> Shaving tool.</li>
                                <li> Progressive tool.</li>
                            </div>
                        </div>
                    </div>
                    <div className="service  col-sm-12 col-md-6 col-lg-4 service__four" data-aos="zoom-out-right" data-aos-easing="linear" data-aos-duration="600" style={{ backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
                        <div className="service-box">
                            <div className="service-img">
                                <gi.GiSwordMold />
                            </div>
                            <div className="service-title">
                                FORGING TOOL DESIGN
                            </div>
                            <div className="service-content">
                                Pharmakraft Solutions offers Printing services to the forging industry
                                as well. we can design a complete mold for up setter, press and hammer
                            </div>
                        </div>
                    </div>
                    <div className="service  col-sm-12 col-md-6 col-lg-4 service__five" data-aos="zoom-out-right" data-aos-easing="linear" data-aos-duration="600" style={{ backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }} >
                        <div className="service-box">
                            <div className="service-img">
                                <tb.TbPackages />
                            </div>
                            <div className="service-title">
                                PACKAGING DESIGN
                            </div>
                            <div className="service-content">
                                We specialize in creating product package designs that not only enhance the
                                customer experience but also optimize costs.
                                <ul>
                                    <li>CORRUGATED BOXES</li>
                                    <li>WOODEN CRATES AND OTHER PACKAGING BOXES</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="service col-sm-12 col-md-6 col-lg-4 service__six" data-aos="zoom-out-right" data-aos-easing="linear" data-aos-duration="600" style={{ backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }} >
                        <div className="service-box">
                            <div className="service-img">
                                <fi.FiPackage />
                            </div>
                            <div className="service-title">
                                PRODUCT DESIGN
                            </div>
                            <div className="service-content">
                                Our industrial design team works alongside our product engineers to develop
                                beautiful concepts that are manufacturable and meet your business
                                requirements.

                            </div>
                        </div>
                    </div>
                    <div className="clear"></div>
                </div>

            </div>
        </div>
    )
}