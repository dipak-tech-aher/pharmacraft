import React, { useEffect, useState, useRef } from "react";
import {
  BsArrowLeftCircle,
  BsArrowRightCircle,
  BsArrowLeftCircleFill,BsArrowRightCircleFill
} from "react-icons/bs";
import img from '../../Assets/images/client.webp'

function shiftLeft() {
  const boxes = document.querySelectorAll(".box");
  const tmpNode = boxes[0];
  boxes[0].className = "box move-out-from-left";

  console.log(boxes.length, "noOfCards");
  setTimeout(() => {
    if (boxes.length >= 5) {
      tmpNode.classList.add("box--hide");
      (boxes[5]).className = "box move-to-position5-from-left"; // cast to Element
    }
    (boxes[1]).className = "box move-to-position1-from-left"; // cast to Element
    (boxes[2]).className = "box move-to-position2-from-left"; // cast to Element
    (boxes[3]).className = "box move-to-position3-from-left"; // cast to Element
    (boxes[4]).className = "box move-to-position4-from-left"; // cast to Element

    boxes[0].remove();

    // Select the parent element using querySelector()
    const parent = document.querySelector(".cards__container");

    // Select all child elements with a certain class
    const childElements = parent.querySelectorAll(".clear");

    // Loop through each child element and remove the class
    childElements.forEach(function (child) {
      child.remove();
    });

    const clearLi = document.createElement("li");
    clearLi.className = "clear";

    document.querySelector(".cards__container").appendChild(tmpNode);
    document.querySelector(".cards__container").appendChild(clearLi);
  }, 500);
}

function shiftRight() {
  const boxes = document.querySelectorAll(".box");
  boxes[4].className = "box move-out-from-right";
  setTimeout(() => {
    const noOfCards = boxes.length;

    if (noOfCards > 4) {
      boxes[4].className = "box box--hide";
    }

    const tmpNode = boxes[noOfCards - 1];
    tmpNode.classList.remove("box--hide");
    boxes[noOfCards - 1].remove();
    const parentObj = document.querySelector(
      ".cards__container"
    );
    parentObj.insertBefore(tmpNode, parentObj.firstChild);
    tmpNode.className = "box move-to-position1-from-right";
    boxes[0].className = "box move-to-position2-from-right";
    boxes[1].className = "box move-to-position3-from-right";
    boxes[2].className = "box move-to-position4-from-right";
    boxes[3].className = "box move-to-position5-from-right";
  }, 500);
}

const EmployeeSpeaks = () => {
  const cardsRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  
  };
  const handleMouseEnter1 = () => {
    setIsHovered1(true);

  };

  const handleMouseLeave1 = () => {
    setIsHovered1(false);
  };

  const totalTestimonial = 8
  return (
    <div className="client">
      <div className="ourtestimonial">
        <div className="client-review">
          <div className="card-center">
            <div className="pre-button">
              <div
                className="button"
                onClick={shiftLeft}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {isHovered ? (
                  <BsArrowLeftCircleFill className="left-slider-icon" />
                ) : (
                  <BsArrowLeftCircle className="left-slider-icon" />
                )}
              
              </div>
            </div>
            <ul className="cards__container" ref={cardsRef}>
            
            {
              Array.from(Array(totalTestimonial), (e, i) => {
                return <li className={i > 4 ? 'box box--hide' : 'box'} key={'testimonial'+i} style={{ float: "left" }}>
                  <div className="card1">
                    <div className="review">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Voluptatibus ipsam, dolores sequi officiis nisi maxime
                      ratione, minus possimus voluptatem labore molestias,
                      sapiente blanditiis fugiat inventore facilis! Nemo vitae eum
                      saepe!
                    </div>
                    <div className="lower">
                      <div className="img">
                        <img  src={img} className="rounded-circle shadow-1-strong mb-4" />
                      </div>
                      <div className="name">Suraj Singh </div>
                      <div className="postion">PM Pixiebytez</div>
                    </div>
                  </div>
                </li>
              })
            }
            
              
              <li className="clear"></li>
            </ul>
            <div className="next-button">
              <div className="button" onClick={shiftRight}  onMouseEnter={handleMouseEnter1}
                onMouseLeave={handleMouseLeave1}>
                {isHovered1 ? (
                  <BsArrowRightCircleFill className="left-slider-icon" />
                ) : (
                  <BsArrowRightCircle className="left-slider-icon" />
                )}
              </div>
            </div>
            <div className="clear"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSpeaks;
