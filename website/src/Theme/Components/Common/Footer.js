import { Link } from 'react-router-dom';
import * as Ti from "react-icons/ti"
import logo from '../../Assets/logos/Logo.jpeg'
import address from '../../Assets/images/location.png'
import contact from '../../Assets/images/call.png'
import gmail from '../../Assets/images/mail.png'
import moment from "moment"


export default function Footer() {
    return (
        <footer className="footer-div">
            <div className="container footer-first">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 footer_logo_300">
                        <div className="footer-logo">
                            <img src={logo} alt="pinnacc" style={{
                                width: "463px"
                            }} />
                        </div>
                        <div className="footer-about">
                            A Solution of Pharma Packaging.
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="footer-title">Contact Info</div>
                        <div className="contact-info-detail">
                            <div className='d-flex'>
                                <div className="footer-contact-info">
                                    <img className='f__img' src={address} />
                                </div>
                                <div className="float-start p-1">
                                    Plot No. 27, Gut No. 42, Behind mahaveer Steel, At Karodi Area, Mumbai Highway, MIDC Walunj, Aurangabad - 431136.
                                </div>
                                <div className="clear"></div>
                            </div>
                            <div>
                                <div className="footer-contact-info">
                                    <img className='f__img' src={contact} />
                                </div>
                                <div className="float-start p-1">
                                    + 91 8888885814
                                </div>
                                <div className="clear"></div>
                            </div>
                            <div>
                                <div className="footer-contact-info">
                                    <img className='f__img' src={gmail} />
                                </div>
                                <div className="float-start p-1">
                                    <a style={{ color: "#ffff" }} href="mailto:vitthal@pharmakraftpackaging.com">vitthal@pharmakraftpackaging.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-second-sec">
                <div className="social-media-icons">
                    {/* <div className="icon-div"><Ti.TiSocialLinkedin /></div> */}
                </div>
            </div>
            <div className='text-center'>© Pharmakraft A Solution of Pharma Packaging {moment().format('YYYY')}. All rights reserved.</div>
        </footer>
    )
}