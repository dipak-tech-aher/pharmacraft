import * as bs from "react-icons/bs"
import { useEffect } from "react";
import AOS from 'aos'

export default function AboutSectionOne() {
    useEffect(() => {
        AOS.init({ delay: 200 })
      }, []);
    return (
        <div>
            <div className="container">
                <div className=" text-center aboutmain_div">
                    <div className="about-sec-one-text">
                        At PINNACC ENGINEERING SOLUTIONS, we specialize in mechanical design solutions that empower businesses to thrive in a competitive market. With a passion for innovation and a commitment to excellence, we offer a comprehensive suite of designing services tailored to your specific needs.
                    </div>
                </div>

                        <div className="about-sec-one-right-boxes"  >
                            <div className="row service_row_">
                                    <div className="col col-lg-4 col-md-6 col-sm-12 service_" data-aos="zoom-out-right" data-aos-easing="linear" data-aos-duration="600">
                                        <div className="service-box_">
                                            <div className="service-img_">
                                                <bs.BsFillGearFill style={{color:"#000"}} />
                                            </div>
                                            <div className="service-title_">
                                                FIXTURE DESIGN
                                            </div>
                                            <div className="service-content_">
                                                Our expert designers craft precision fixtures to enhance manufacturing processes, ensuring efficiency and accuracy in production. Our Fixture Design services stand out as a cornerstone in optimizing your manufacturing processes .  We understand that each manufacturing setup is unique. Our team works closely with you to create bespoke fixture designs tailored to your specific requirements.

                                            </div>
                                        </div>
                                    </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 service_"  data-aos="zoom-out-right" data-aos-easing="linear" data-aos-duration="600"> 
                                    <div className="service-box_">
                                        <div className="service-img_">
                                           <bs.BsFillGearFill style={{color:"#000"}} />
                                        </div>
                                        <div className="service-title_">
                                            FORGING TOOL DESIGN
                                        </div>
                                        <div className="service-content_">
                                            Our skilled engineers develop forging designs that optimize material usage and enhance the strength and quality of forged components.we specialize in the art of Forging Tool Design, bringing innovation and precision to every step of your manufacturing journey. Our team, well-versed in mechanical design CAD, CATIA, and Inventor software, ensures that each forging tool is a masterpiece of efficiency and reliability.
                                        </div>
                                    </div>
                                </div>
                                <div className=" col-lg-4 col-md-6 col-sm-12 service_"  data-aos="zoom-out-right" data-aos-easing="linear" data-aos-duration="600">
                                    <div className="service-box_">
                                        <div className="service-img_">
                                           <bs.BsFillGearFill style={{color:"#000"}} />
                                        </div>
                                        <div className="service-title_">
                                            PRESS TOOL DESIGN
                                        </div>
                                        <div className="service-content_">
                                            We excel in creating press tools that streamline metalworking processes, enhancing productivity and reducing production costs.Unlock precision and efficiency in your manufacturing with Pinnac Engineering Solutions's expert Press Tool Design services. Our seasoned professionals specialize in creating cutting-edge designs using advanced technologies. Whether you need intricate details or robust performance, we tailor press tools to meet your unique specifications.
                                        </div>
                                    </div>
                                </div>
                                <div className=" col-lg-4 col-md-6 col-sm-12 service_"data-aos="zoom-out-right" data-aos-easing="linear" data-aos-duration="600">
                                    <div className="service-box_">
                                        <div className="service-img_">
                                           <bs.BsFillGearFill style={{color:"#000"}} />
                                        </div>
                                        <div className="service-title_">
                                            PRODUCT DESIGN
                                        </div>
                                        <div className="service-content_">
                                            Our industrial design team works alongside our product engineers to develop beautiful concepts that are manufacturable and meet your business requirements. we specialize in delivering cutting-edge product design solutions that transcend expectations. With a focus on user-centric innovation, our team employs advanced methodologies to bring your ideas to life. From concept to reality, our expertise in mechanical design CAD, CATIA, and Inventor software ensures meticulous detailing and precision in every product.
                                        </div>
                                    </div>
                                </div>
                                <div className=" col-lg-4 col-md-6 col-sm-12 service_"data-aos="zoom-out-right" data-aos-easing="linear" data-aos-duration="600">
                                    <div className="service-box_">
                                        <div className="service-img_">
                                           <bs.BsFillGearFill style={{color:"#000"}} />
                                        </div>
                                        <div className="service-title_">
                                            STRUCTURAL DESIGN
                                        </div>
                                        <div className="service-content_">
                                        Discover cutting-edge Structural Design services at Pinnac Engineering Solutions. Our expert team, proficient in advanced engineering software, brings a unique blend of creativity and technical precision to redefine the landscape of structural engineering. We create robust structural designs that are the foundation for safe and reliable mechanical systems. ensure your products reach customers intact.
                                        </div>
                                    </div>
                                </div>
                                <div className=" col-lg-4 col-md-6 col-sm-12 service_"data-aos="zoom-out-right" data-aos-easing="linear" data-aos-duration="600">
                                    <div className="service-box_">
                                        <div className="service-img_">
                                           <bs.BsFillGearFill style={{color:"#000"}} />
                                        </div>
                                        <div className="service-title_">
                                            PACKAGING DESIGN
                                        </div>
                                        <div className="service-content_">
                                        At Pinnac Engineering Solutions, we specialize in delivering cutting-edge Packaging Design services that seamlessly blend creativity with functionality. Our expert team leverages their design prowess to create visually appealing and strategically crafted packaging solutions. Whether you require eye-catching product packaging or efficient logistics solutions, our designs are tailored to leave a lasting impression. We understand the importance of packaging in brand identity and product protection. Our designs not only look appealing but also ensure your products reach customers intact.
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
            </div>
        </div>
    )
}