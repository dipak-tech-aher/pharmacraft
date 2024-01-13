import img from '../../Assets/images/why-choose-us-profile.png'
export default function WhyChooseUs(){

    return(
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="why-choose-us-profile-img" data-aos="zoom-in-left" data-aos-easing="linear" data-aos-duration="600">
                            <img src={img} />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12"  data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                        <p className='why-choose-us_p'>
                            With our extensive expertise and abundant resources, we are well-equipped to
                            assist you in designing new products or enhancing existing ones. Our team of
                            professionals possesses the necessary knowledge and skills to tackle complex
                            design challenges, delivering innovative and impactful solutions. We are
                            committed to helping you achieve your goals by employing our experience and
                            leveraging our comprehensive range of resources.
                            By choosing us as your partner, you can expect a seamless and efficient
                            collaboration where your vision and objectives take center stage. We are
                            dedicated to surpassing your expectations, providing unparalleled quality and a
                            level of service that sets us apart. With our proven track record and commitment
                            to excellence, we are confident in our ability to meet and exceed your design
                            expectations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}