import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Icons from "../Icons";

const HeroComponent = () => {
  const data = [
    {
      id: 1,
      heading: "Custom AI Solutions",
      text: "Design and implement AI-powered applications (e.g., recommendation systems, predictive analytics, NLP tools) using AI technologies like TensorFlow, PyTorch, and OpenAI APIs.",
    },
    {
      id: 7,
      heading: "AI-Driven CX",
      text: "Positive Customer Experience increases customer retention and brand loyalty. Intelligent chatbots, virtual assistants, or automated support systems enhance customer engagement while minimizing the need for extensive human intervention",
      icon: "FaRobot",
    },
    {
      id: 4,
      heading: "Cloud Integration",
      text: "Modernize and migrate legacy Java applications to the cloud (AWS, Azure, GCP) for improved flexibility and reduced infrastructure costs while ensuring seamless integration with AI technologies",
    },
    {
      id: 6,
      heading: "Data-Driven Insights",
      text: "Develop and deploy big data solutions using Hadoop, Apache Spark, or Kafka, enabling businesses to harness data insights for informed decision-making",
    },
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
    <div className='flex flex-row w-full h-lvh items-center justify-center max-w-full p-5 z-50 bg-stone-300 dark:bg-stone-800'>
      <Icons.ChevronsRight className='hidden md:visible' />
      <div className='w-full overflow-auto '>
        <div className='flex flex-col md:flex-row items-center md:gap-10 gap-10 h-lvh p-5 w-full'>
          {data.map((d) => (
            <Card
              key={d.id}
              className='h-64 md:w-64 w-full min-h-64 md:min-w-64 glow-card'
            >
              <CardHeader className='glow-card-header'>
                <CardTitle className='font-semibold  flex gap-2 justify-items-center '>
                  <Icons.FaRobot className='text-yellow-400 h-8 w-8 min-h-8 min-w-8' />
                  <div className='flex flex-row text-lg'>{d.heading}</div>
                </CardTitle>
              </CardHeader>
              <CardContent className='p-3'>{d.text}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroComponent;
