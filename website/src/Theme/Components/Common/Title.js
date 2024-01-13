export default function Title(props) {
    return(
        <div className='section-title'>
            <div className='title-text' data-aos="zoom-in-right" data-aos-easing="linear" data-aos-duration="600">
                <span className='text-one'>{props.textone}</span>
                <div>
                    <div className='back-line-left'></div>
                    <div className='back-line-right'></div>
                </div>
            </div>
        </div>
    )
}