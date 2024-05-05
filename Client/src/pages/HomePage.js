import React, { useContext, useState, useEffect, useRef } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";
import imageroom from "../assets/images/imageroom.jpg";
import imageroom1 from "../assets/images/imageroom1.jpg";
import imageroom2 from "../assets/images/imageroom2.jpg";

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const targetRef = useRef(null);
  const conferenceManagementRef = useRef(null);
  const submitPapersRef = useRef(null);
  const reviewProcessRef = useRef(null);

  const images = [
    { src: imageroom, text: "", sectionId: "conference-management" },
    { src: imageroom2, text: "", sectionId: "submit-papers" },
    { src: imageroom1, text: "", sectionId: "review-process" },
  ];

  const durationInSeconds = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, durationInSeconds * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleImageClick = (id) => {
    let sectionRef;
    switch (id) {
      case "conference-management":
        sectionRef = conferenceManagementRef;
        break;
      case "submit-papers":
        sectionRef = submitPapersRef;
        break;
      case "review-process":
        sectionRef = reviewProcessRef;
        break;
      default:
        break;
    }

    if (sectionRef && sectionRef.current) {
      const offsetTop = sectionRef.current.offsetTop;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <DashboardLayout>
      <div style={{ position: "relative", textAlign: "center" }}>
        <div
          style={{ height: "400px", overflow: "hidden", position: "relative" }}
        >
          <img
            src={images[currentImageIndex].src}
            alt={`Image ${currentImageIndex + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() =>
              handleImageClick(images[currentImageIndex].sectionId)
            }
            title="Click to discover more"
          />
          <div
            ref={targetRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              padding: "20px",
              fontSize: "70px",
              color: "white",
              width: "100%",
              opacity: 1,
            }}
          >
            {images[currentImageIndex].text}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => handleDotClick(index)}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: currentImageIndex === index ? "#000" : "#ccc",
                margin: "0 5px",
                cursor: "pointer",
                opacity: 0.6, // Apply opacity to dots
              }}
            />
          ))}
        </div>
      </div>

      {/* Render Conference Management section */}
      {currentImageIndex === 0 && (
        <div
          ref={conferenceManagementRef}
          id="conference-management"
          style={{ textAlign: "center", padding: "20px 20px" }}
        >
          <div style={{ padding: "20px" }}>
            <h2
              style={{ padding: "10px", borderRadius: "5px", color: "#6495ED" }}
            >
              Conference Management
            </h2>
            <p>
              Organize, manage, and coordinate with authors and reviewers.
              <br></br>
              UAL Conf simplifies the creation, organization and management of
              your conference.
            </p>
          </div>
        </div>
      )}

      {/* Render Submit Papers section */}
      {currentImageIndex === 1 && (
        <div
          ref={submitPapersRef}
          id="submit-papers"
          style={{ textAlign: "center", padding: "20px 20px" }}
        >
          <div style={{ padding: "20px" }}>
            <h2
              style={{ padding: "10px", borderRadius: "5px", color: "#6495ED" }}
            >
              Submit Papers
            </h2>
            <p>
              Submit your papers effortlessly. <br></br>
              UAL Conf simplifies the submition of all the necessary documents
              for the conference.
            </p>
          </div>
        </div>
      )}

      {/* Render Review Process section */}
      {currentImageIndex === 2 && (
        <div
          ref={reviewProcessRef}
          id="review-process"
          style={{ textAlign: "center", padding: "20px 20px" }}
        >
          <div style={{ padding: "20px" }}>
            <h2
              style={{ padding: "10px", borderRadius: "5px", color: "#6495ED" }}
            >
              Review Process
            </h2>
            <p>
              Efficiently review papers and manage the entire review process.
              <br></br>
              UAL Conf simplifies the review, and control of the different
              versions, to achieve a final version of your conference.
            </p>
          </div>
        </div>
      )}
      <Footer />
    </DashboardLayout>
  );
}
