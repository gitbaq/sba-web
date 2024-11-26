import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Icons from "../Icons";

const HeroComponent = () => {
  const data = [
    {
      id: 1,
      heading: "Custom AI Solutions",
      text: "Design and implement AI-powered applications (e.g., recommendation systems, predictive analytics, NLP tools) tailored to your business needs using cutting-edge AI technologies like TensorFlow, PyTorch, and OpenAI APIs.",
    },
    {
      id: 2,
      heading: "Cost Optimization",
      text: "Optimize existing Java applications for performance and scalability by employing efficient algorithms, asynchronous processing, microservices architecture, and serverless computing, reducing operational costs",
    },
    {
      id: 3,
      heading: "Adherence to Best Practices",
      text: "Implement robust, maintainable, and scalable code following industry best practices, including SOLID principles, clean code standards, and secure coding guidelines to ensure high-quality software delivery",
    },
    {
      id: 4,
      heading: "Cloud Integration",
      text: "Modernize and migrate legacy Java applications to the cloud (AWS, Azure, GCP) for improved flexibility and reduced infrastructure costs while ensuring seamless integration with AI technologies",
    },
    {
      id: 5,
      heading: "DevOps and Automation",
      text: "Enhance software delivery pipelines with CI/CD processes, containerization (Docker), and orchestration (Kubernetes), improving efficiency and reducing time-to-market",
    },
    {
      id: 6,
      heading: "Data-Driven Insights",
      text: "Develop and deploy big data solutions using Hadoop, Apache Spark, or Kafka, enabling businesses to harness data insights for informed decision-making",
    },
    {
      id: 7,
      heading: "AI-Driven Customer Experiences",
      text: "Build intelligent chatbots, virtual assistants, or automated support systems that enhance customer engagement while minimizing the need for extensive human intervention",
    },
  ];
  return (
    <div className='flex flex-row w-full overflow-auto pb-5'>
      {data.map((d) => (
        <Card
          key={d.id}
          className='bg-cyan-100 bg-opacity-80 md:m-5 m-2 min-w-[250] h-[350px]'
        >
          <CardHeader className='flex flex-row gap-1 bg-gradient-to-br from-cyan-500 to-transparent'>
            <Icons.StepForward className='text-green-700' />
            <CardTitle className=' items-center card-heading text-cyan-950 font-russo'>
              {d.heading}
            </CardTitle>
          </CardHeader>
          <CardContent className='reg-text mt-2'>{d.text}</CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HeroComponent;
