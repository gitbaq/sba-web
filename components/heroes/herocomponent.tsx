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
      id: 2,
      heading: "Cost Optimization",
      text: "Optimize existing applications for performance and scalability by employing efficient algorithms, asynchronous processing, microservices architecture, and serverless computing, reducing operational costs",
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
    <div className='max-w-full w-full overflow-auto my-5'>
      <div className='flex flex-row gap-1 max-w-full'>
        {data.map((d) => (
          <Card
            key={d.id}
            className='min-w-72 md:w-1/6 w-1/2 min-h-48 h-48 hover:border overflow-auto'
          >
            <CardHeader className='shadow-sm p-3 bg-gradient-to-b from-indigo-50 to-transparent'>
              <CardTitle className='font-semibold flex flex-row gap-2 items-center '>
                <Icons.CircleCheckBig className='text-emerald-400 h-4 w-4 min-h-4 min-w-4' />
                {d.heading}
              </CardTitle>
            </CardHeader>
            <CardContent className='py-2 px-3 text-xs'>{d.text}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HeroComponent;
