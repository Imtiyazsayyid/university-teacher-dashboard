import React from "react";

const EmbeddedYoutubeVideo = ({ link, width }: { link: string; width?: number }) => {
  function convertToEmbeddableLink(youtubeLink: string) {
    var regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    var match = youtubeLink.match(regExp);
    if (match) {
      var videoId = match[1];
      var embeddableLink = "https://www.youtube.com/embed/" + videoId;
      return embeddableLink;
    } else {
      return null;
    }
  }
  return (
    <div className="rounded-xl overflow-hidden border">
      <iframe
        allowFullScreen
        src={
          convertToEmbeddableLink(link) ||
          "https://storage.googleapis.com/support-forums-api/attachment/message-223455524-4125100802620654799.jpg"
        }
      ></iframe>
    </div>
  );
};

export default EmbeddedYoutubeVideo;
