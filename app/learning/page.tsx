import React from "react";

const page = () => {
  return (
    <div
      className='flex flex-col md:h-lvh min-h-lvh w-full min-w-full items-center justify-center 
    font-russo
    bg-[url("/wordcloud.png")]'
    >
      <div className='flex flex-row bg-opacity-95 bg-gray-100 md:h-full h-fit w-full items-center justify-center'>
        <div
          className='flex flex-col md:max-w-lg max-w-full w-full
    font-russo lead_text md:px-0 px-5'
        >
          &quot;We now accept the fact that learning is a lifelong process of
          keeping abreast of change. And the most pressing task is to teach
          people how to learn.&quot; <br />
          <br />
          <div className='w-full text-right icons_diff text-pink-800'>
            Peter Drucker
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
