import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import { Helmet } from "react-helmet";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useParams, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

export default function SingleTalents() {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fieldData, setFieldData] = useState({
    your_name: "",
    your_email: "",
    your_number: "",
    your_message: "",
    _wpcf7_unit_tag: 1932,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [verified, setVerified] = useState(false);
  const [relatedVoices, setRelatedVoices] = useState([]); // Ensure it's initialized as an array

  let { id } = useParams();
  let history = useHistory();

  useEffect(() => {
    fetch(`https://greatbritishvoices.co.uk/wp-json/custom/v1/news/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetch(
      "https://www.greatbritishvoices.co.uk/wp-json/custom/v1/full-post/3078"
    )
      .then((res) => res.json())
      .then((json) => {
        setItems(json.acf_fields);
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    fetch(`https://greatbritishvoices.co.uk/wp-json/custom/v1/talents/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRelatedVoices(data);
        } else {
          setRelatedVoices([]); // Fallback if the response is not an array
        }
      })
      .catch((error) => {
        console.error("Error fetching related voices:", error);
        setRelatedVoices([]); // Set to empty array on error
      });
  }, [id]);

  if (loading) {
    return (
      <div className="please_wait">
        <div className="loader"></div>
        <span>Data Loading....</span>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!post) {
    return <div>No post found</div>;
  }

  // Form Validation and Submission
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldData({
      ...fieldData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(fieldData.your_email)) {
      setSubmitError("Invalid email format");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("your_name", fieldData.your_name);
    formData.append("your_email", fieldData.your_email);
    formData.append("your_number", fieldData.your_number);
    formData.append("_wpcf7_unit_tag", 1932);
    formData.append("your_message", fieldData.your_message);

    fetch(
      "https://www.greatbritishvoices.co.uk/wp-json/custom/v1/full-post/3078",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setSubmitSuccess(true);
        setFieldData({
          your_name: "",
          your_email: "",
          your_number: "",
          your_message: "",
          _wpcf7_unit_tag: 1932,
        });
        setSubmitting(false);
      })
      .catch((error) => {
        console.error("There was a problem submitting the form:", error);
        setSubmitting(false);
        setSubmitError(
          "There was a problem submitting the form. Please try again later."
        );
      });
  };

  const onChange = (value) => {
    console.log("Captcha value:", value);
    setVerified(true);
  };

  const handleBackClick = () => {
    history.goBack();
  };

  return (
    <>
      <Helmet>
        <title>{post.first_name} | Great British UK Talent</title>
      </Helmet>

      <div className="single__talent__bredcrumb">
        <Row className="singleBlogTitle">
          <Col md={3}>
            <Link to="/voice-search" className="button goto__blogPage">
              <MdKeyboardArrowLeft />
              Back To Search
            </Link>
          </Col>
          <Col md={6} className="text-center">
            <h4>{post.first_name}</h4>
          </Col>
          <Col md={3} className="text-end"></Col>
        </Row>

        <Row className="align-items-center ">
          <Col md="4">
            <div className="profile__talent text-center">
              <img src={post.featured_image} alt=""/>
            </div>
          </Col>
          <Col md="8">
            <div className="talent_about">
              <h2>{post.first_name}</h2>
              <p>Gender: {post.gender}</p>
              <p dangerouslySetInnerHTML={{ __html: post.key_information }}></p>
              <p dangerouslySetInnerHTML={{ __html: post.about_speaker }}></p>
            </div>
          </Col>
        </Row>
      </div>

      <div
        className="parallax-banner"
        style={{ backgroundImage: `url(${post.banner_photo})` }}
      ></div>

      <div className="moreAbout__talents sectionpadding">
        <Row>
          <Col md="7">
            <h1>More about {post.first_name}</h1>
            <p
              dangerouslySetInnerHTML={{ __html: post.more_about_speaker }}
            ></p>
          </Col>
          <Col md="5"></Col>
        </Row>
      </div>

      <section className="get_in_touch">
        <Row className="align-items-start">
          <Col md={6}>
            <div className="contact_form">
              <h3>Get In Touch</h3>

              <form
                className="submit_form"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                {/* Input */}
                <div className="input_group">
                  <input
                    type="text"
                    placeholder="Name"
                    name="your_name"
                    className="input_design"
                    id="name"
                    required
                    value={fieldData.your_name}
                    onChange={handleChange}
                  />
                </div>
                {/* Input */}
                <div className="input_group">
                  <input
                    type="email"
                    placeholder="Email"
                    name="your_email"
                    id="email"
                    className="input_design"
                    required
                    value={fieldData.your_email}
                    onChange={handleChange}
                  />
                  {submitError && <p className="submit-error">{submitError}</p>}
                </div>
                {/* Input */}
                <div className="input_group">
                  <input
                    type="text"
                    placeholder="Contact Number"
                    name="your_number"
                    id="phone"
                    className="input_design"
                    required
                    value={fieldData.your_number}
                    onChange={handleChange}
                  />
                </div>
                <div className="input_group">
                  <textarea
                    placeholder="Message"
                    name="your_message"
                    id="message"
                    className="input_design"
                    required
                    value={fieldData.your_message}
                    onChange={handleChange}
                  />
                </div>
                <div className="input_group captachaPanel">
                  <ReCAPTCHA
                    sitekey="6LdHCM4pAAAAAFqVjB4zBx_YMF6hgxkTIsyoTxrV"
                    onChange={onChange}
                  />
                </div>
                <div className="input_group submit_btn">
                  <button
                    type="submit"
                    className="button"
                    disabled={!verified || submitting}
                  >
                    Submit
                  </button>
                  {submitting && <div className="loader"></div>}
                </div>
                <div className="input_group">
                  {submitSuccess && (
                    <div className="submit-success">
                      {" "}
                      <p>
                        <img
                          src="https://greatbritish.b-cdn.net/wp-content//uploads/2024/05/good-job-hand-2-svgrepo-com.png"
                          alt=""
                        />
                        Thank You For Contacting!
                      </p>{" "}
                      <span>We will get back to you shortly.</span>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </Col>
          <Col md={6}>
            <div className="contact_form_img">
              <img src={items.about_image} alt="" />
            </div>
            <Col md={12}>
              <div className="footer_details">
                <ul>
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      fill="#fff"
                      className="bi bi-google"
                      viewBox="0 0 334.5 334.5"
                    >
                      <path d="M332.797,13.699c-1.489-1.306-3.608-1.609-5.404-0.776L2.893,163.695c-1.747,0.812-2.872,2.555-2.893,4.481 s1.067,3.693,2.797,4.542l91.833,45.068c1.684,0.827,3.692,0.64,5.196-0.484l89.287-66.734l-70.094,72.1 c-1,1.029-1.51,2.438-1.4,3.868l6.979,90.889c0.155,2.014,1.505,3.736,3.424,4.367c0.513,0.168,1.04,0.25,1.561,0.25 c1.429,0,2.819-0.613,3.786-1.733l48.742-56.482l60.255,28.79c1.308,0.625,2.822,0.651,4.151,0.073 c1.329-0.579,2.341-1.705,2.775-3.087L334.27,18.956C334.864,17.066,334.285,15.005,332.797,13.699z" />
                    </svg>
                    <a href="mailto:alex@greatbritishvoices.co.uk">
                      {items.email}
                    </a>
                  </li>

                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      fill="#fff"
                      className="bi bi-google"
                      viewBox="0 0 512 512"
                      transform="matrix(-1, 0, 0, 1, 0, 0)"
                    >
                      <path d="M478.94,370.14c-5.22-5.56-23.65-22-57.53-43.75-34.13-21.94-59.3-35.62-66.52-38.81a3.83,3.83,0,0,0-3.92.49c-11.63,9.07-31.21,25.73-32.26,26.63-6.78,5.81-6.78,5.81-12.33,4-9.76-3.2-40.08-19.3-66.5-45.78s-43.35-57.55-46.55-67.3c-1.83-5.56-1.83-5.56,4-12.34.9-1.05,17.57-20.63,26.64-32.25a3.83,3.83,0,0,0,.49-3.92c-3.19-7.23-16.87-32.39-38.81-66.52-21.78-33.87-38.2-52.3-43.76-57.52A3.9,3.9,0,0,0,138,32.2,322.35,322.35,0,0,0,82,57.65,338,338,0,0,0,33.35,92a3.83,3.83,0,0,0-1.26,3.74c2.09,9.74,12.08,50.4,43.08,106.72,31.63,57.48,53.55,86.93,100,133.22S252,405.21,309.54,436.84c56.32,31,97,41,106.72,43.07a3.86,3.86,0,0,0,3.75-1.26A337.73,337.73,0,0,0,454.35,430a322.7,322.7,0,0,0,25.45-56A3.9,3.9,0,0,0,478.94,370.14Z" />
                    </svg>
                    <a href="tel: +01753 439 289">{items.phone_number}</a>
                  </li>
                </ul>
              </div>
            </Col>
          </Col>
        </Row>
      </section>

      <section className="testimonials sectionpadding">
        <Container>
          <Row>
            <h2>Testimonials</h2>
            <p dangerouslySetInnerHTML={{ __html: post.testimonials }}></p>
          </Row>
        </Container>
      </section>

      <section className="related-voices sectionpadding">
        <h2>Similar Talent</h2>
        <Row>
          {Array.isArray(relatedVoices) && relatedVoices.length > 0 ? (
            relatedVoices.map((voice, index) => (
              <Col md="4" key={index}>
                <div className="related-voice-card">
                  <img src={voice.profile_image} alt={voice.name} />
                  <h3>{voice.name}</h3>
                  <p>{voice.description}</p>
                  <Link to={`/voice/${voice.id}`}>Learn More</Link>
                </div>
              </Col>
            ))
          ) : (
            <Col>
              <p>No related voices found.</p>
            </Col>
          )}
        </Row>
      </section>
    </>
  );
}
