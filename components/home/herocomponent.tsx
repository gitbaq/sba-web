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
    // {
    //   id: 6,
    //   heading: "Data-Driven Insights",
    //   text: "Develop and deploy big data solutions using Hadoop, Apache Spark, or Kafka, enabling businesses to harness data insights for informed decision-making",
    // },
    // {
    //   id: 2,
    //   heading: "Cost Optimization",
    //   text: "Optimize existing applications for performance and scalability by employing efficient algorithms, asynchronous processing, microservices architecture, and serverless computing, reducing operational costs",
    // },
    // {
    //   id: 3,
    //   heading: "Adherence to Best Practices",
    //   text: "Implement robust, maintainable, and scalable code following industry best practices, including SOLID principles, clean code standards, and secure coding guidelines to ensure high-quality software delivery",
    // },

    {
      id: 5,
      heading: "DevOps and Automation",
      text: "Enhance software delivery pipelines with CI/CD processes, containerization (Docker), and orchestration (Kubernetes), improving efficiency and reducing time-to-market",
    },
  ];
  return (
    <div className='flex lg:flex-row flex-col w-full items-center justify-center p-5 z-50 max-w-4xl'>
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
