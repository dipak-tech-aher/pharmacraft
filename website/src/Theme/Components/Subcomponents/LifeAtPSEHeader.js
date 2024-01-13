import img from '../../Assets/images/lifeatpixie-circle2.png';
import imgOne from '../../Assets/images/tick-mark.png';
import logo from '../../Assets/images/PES-3-.png';


export default function LifeAtPSEHeader() {
    return (
        <div className="life-at-pixie-header-container">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12" data-aos="zoom-in-left" data-aos-easing="linear" data-aos-duration="600">
                        <div className="left-image-container">
                            <div className="life-at-pixie-main-image">
                                <img src={img} />
                                <div className="life-at-pixie-small-image">
                                    {/* <img src={logo} className='LifeAtPse_logo' /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12" data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                        <div className="right-text-container">
                            <div className="lifeatpixie-header-title">
                                A vibrant and collaborative work environment.
                            </div>
                            <div className="lifeatpixie-header-content">Skilled and passionate professionals from diverse backgrounds, dedicated to delivering high-quality services. We promote work-life balance and prioritize learning and development through training, industry events, and conferences.</div>
                            <div className="lifeatpixie-header-points">
                                <div className="lifeatpixie-header-point">
                                    <div className="pointer-image">
                                        <img src={imgOne} />
                                    </div>
                                    <div className="pointer-text">
                                        Valuing team members, fostering personal and professional growth.
                                    </div>
                                </div>
                                <div className="lifeatpixie-header-point">
                                    <div className="pointer-image">
                                        <img src={imgOne} />
                                    </div>
                                    <div className="pointer-text">
                                        Supportive leaders providing guidance and assistance.
                                    </div>
                                </div>
                            </div>
                            <div className="lifeatpixie-header-points">
                                <div className="lifeatpixie-header-point">
                                    <div className="pointer-image">
                                        <img src={imgOne} />
                                    </div>
                                    <div className="pointer-text">
                                    Encouraging open communication and collaboration for a strong team dynamic.
                                    </div>
                                </div>
                                <div className="lifeatpixie-header-point">
                                    <div className="pointer-image">
                                        <img src={imgOne} />
                                    </div>
                                    <div className="pointer-text">
                                    Employee benefits: competitive compensation, flexible work arrangements, and a friendly environment\                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}