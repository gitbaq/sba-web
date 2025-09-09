import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Icons from "../Icons";

const HeroComponent = () => {
  const data = [
    {
      id: 1,
      heading: "Custom AI Solutions",
      text: "Design and implement AI-powered applications (e.g., Generative AI, predictive analytics, NLP tools)",
    },
    {
      id: 7,
      heading: "AI-Driven CX",
      text: "Positive Customer Experience, Intelligent chatbots, Virtual assistants, or Automated support systems enhance customer engagement while minimizing human intervention",
      icon: "FaRobot",
    },
    {
      id: 4,
      heading: "Cloud Integration",
      text: "Modernize and migrate legacy Java applications to the cloud (AWS, Azure, GCP) for improved flexibility and reduced infrastructure costs and seamless integration with AI technologies",
    },

    {
      id: 5,
      heading: "DevOps and Automation",
      text: "Enhance software delivery pipelines with CI/CD processes, containerization (Docker), and orchestration (Kubernetes), improving efficiency and reducing time-to-market",
    },
  ];
  return (
    <div className='flex lg:flex-row flex-col w-full items-center justify-center p-1 z-50 max-w-4xl bg-gradient-to-b from-stone-100 to-stone-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl'>
      <Icons.ChevronsRight className='hidden md:visible' />
      <div className='grid md:grid-cols-2 grid-cols-1 grid-flow-row md:gap-5 gap-2 p-5 w-fit place-items-center justify-around'>
        {data.map((d) => (
          <Card key={d.id} className='md:min-h-96 h-64 w-full glow-card'>
            <CardHeader className='glow-card-header flex flex-row gap-2 items-center'>
              <Icons.FaRobot className='text-yellow-400 h-8 w-8 min-h-8 min-w-8' />
              <CardTitle className='font-semibold'>
                <div className='flex flex-row'>{d.heading}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className='p-3 flex-inline'>{d.text}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HeroComponent;
