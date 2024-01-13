import img from '../../Assets/images/what-we-do-icon.png'
export default function WhatWeDo(){ 
    return(
        <div className="whatwedo-inner-page-container">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-12" data-aos="zoom-in-left" data-aos-easing="linear" data-aos-duration="600">
                        <div className="what-we-do-container">
                            <div className="what-we-do-img">
                                <img src={img} />
                            </div>
                            <div className="what-we-do-title">Mechanical Design</div>
                            <div className="what-we-do-content">Our seasoned team of mechanical engineers excels in the art and science of designing robust, efficient, and innovative mechanical systems. From concept to execution, we ensure that every detail is meticulously crafted to meet the highest industry standards.</div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12" data-aos="zoom-in-left" data-aos-easing="linear" data-aos-duration="600">
                        <div className="what-we-do-container">
                            <div className="what-we-do-img">
                                <img src={img} />
                            </div>
                            <div className="what-we-do-title">Product Optimization</div>
                            <div className="what-we-do-content">We go beyond the initial design phase to optimize products for performance, cost-efficiency, and manufacturability. Our goal is to enhance the functionality and market competitiveness of your products.</div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12" data-aos="zoom-in-left" data-aos-easing="linear" data-aos-duration="600">
                        <div className="what-we-do-container">
                            <div className="what-we-do-img">
                                <img src={img} />
                            </div>
                            <div className="what-we-do-title">Collaborative Approach</div>
                            <div className="what-we-do-content">Your vision is our mission. We collaborate closely with clients, fostering a transparent and communicative process. This ensures that your requirements are not only met but exceeded.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}