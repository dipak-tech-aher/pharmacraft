import logo from '../../Assets/images/PES-3-.png'
import img from "../../Assets/design/CF1.1.jpg"
import imgOne from "../../Assets/design/SWF2.jpg"
import imgTwo from "../../Assets/design/RFC2.jpg"

// import img from "../../Assets/design/hm2.jpg"
// import imgOne from "../../Assets/design/hm3.jpg"
// import imgTwo from "../../Assets/design/hm4.jpg"
import imgThree from "../../Assets/design/hm1.jpg"
import { useEffect, useRef, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function HomeSlider() {

    const [shouldScrollToTop, setShouldScrollToTop] = useState(true);

    useEffect(() => {
        if (shouldScrollToTop) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setShouldScrollToTop(false);
        }
    }, [shouldScrollToTop]);
    return (
        <>
            <div data-aos="zoom-out-right" className="" >
                <Carousel styles={styles} infiniteLoop={true} autoPlay={true} preventMovementUntilSwipeScrollTolerance={true} swipeScrollTolerance={50} >
                    <div>
                        <img src={img} className="homeSlider" alt='Img' />
                        <p className="legend">Legend 1</p>
                    </div>
                    <div>
                        <img src={imgOne} className="homeSlider" alt='Img' />
                        <p className="legend">Legend 2</p>
                    </div>
                    <div>
                        <img src={imgTwo} className="homeSlider" alt='Img' />
                        <p className="legend">Legend 3</p>
                    </div>
                </Carousel>
            </div>
            <div className="home_img_round"  >
                <div className="home_img_round_main" data-aos="zoom-out-right" >
                    <div className="home__logo_text">
                        <img className="home_img_" src={logo} alt="pinnacc" />
                        <span className="home_img_round_text">Elevate Your Printings with Pharmakraft Solutions</span>
                    </div>
                </div>
            </div>

        </>
    )
}