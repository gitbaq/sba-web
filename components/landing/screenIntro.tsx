import React from "react";
import Socials from "../socials";

const ScreenIntro = () => {
  return (
    <div className='flex flex-col h-full w-full md:p-10 p-10 items-center gap-5'>
      <p className='max-w-lg text-xl text-center'>
        I have helped clients streamline operations, enhance decision-making,
        and unlock new growth opportunities.
        <br />
        <br />
        My commitment to understanding unique challenges allows me to deliver
        tailored, impactful strategies, empowering businesses to stay
        competitive in an ever-evolving digital landscape. <br />
        <br />
        Let’s turn your vision into measurable success.
      </p>
      <div className='flex flex-row justify-evenly max-w-lg w-full text-cyan-700 text-2xl'>
        <Socials />
      </div>
    </div>
  );
};

export default ScreenIntro;
