import React, { useEffect, useState } from "react";
import VoiceCards from "./VoiceCards";
import CelebrityVoicesApi from "./CelebrityVoicesApi";

export default function CelebrityVoicePage() {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch(
      "https://greatbritishvoices.co.uk/wp-json/custom/v1/post/celebrity-voices"
    )
      .then((res) => res.json())
      .then((json) => {
        setItems(json.post_11809.acf_fields);
        setIsLoaded(true);
      });
  }, []);
 
 
  if (!isLoaded)
    return (
      <div className="please_wait">
        {" "}
        <div class="loader"> </div>
        <span>Data Loading....</span>
      </div>
    );
  return (
    <>
      <section className="celebrity__voices__bannersection">
      <img src={items.banner_image_gbv.url} alt="" />
      </section>
      <section className="celebrit__voices__text sectionpadding">
        <p dangerouslySetInnerHTML={{__html:items.featured_section_content_second_section}}></p>
      </section>
      <section className="celebrity__Voices_API">
        <CelebrityVoicesApi/>
      </section>
      </>
  );
}
