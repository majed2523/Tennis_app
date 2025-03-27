'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import Link from 'next/link';

const features = [
  {
    title: 'Expert Coaches',
    description:
      'Train with our certified professional coaches who have experience working with players of all levels, from beginners to tournament competitors.',
    imgSrc:
      'https://images.pexels.com/photos/1432035/pexels-photo-1432035.jpeg',
    icon: <Award className="h-6 w-6 text-green-400" />,
    position: 'right',
    link: '/coaches',
  },
  {
    title: 'Court Reservations',
    description:
      'Book your preferred court with our easy-to-use online reservation system. Indoor and outdoor options available year-round.',
    imgSrc: '/assets/court.jpg',
    icon: <MapPin className="h-6 w-6 text-green-400" />,
    position: 'left',
    link: '/reservation',
  },
  {
    title: 'Club Schedules',
    description:
      'Stay updated with our comprehensive calendar of tournaments, social events, and special training sessions for all members.',
    imgSrc: 'assets/team.jpg',
    icon: <Calendar className="h-6 w-6 text-green-400" />,
    position: 'right',
    link: '/schedule',
  },
];

export default function FeatureCards() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-16 px-4">
      <div className="flex flex-col gap-16 w-full max-w-6xl">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ feature, index }) {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: index * 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={cardVariants}
    >
      <Card
        className="overflow-hidden border-0 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-300 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          <div
            className={`flex flex-col ${
              feature.position === 'left'
                ? 'md:flex-row-reverse'
                : 'md:flex-row'
            } items-stretch`}
          >
            {/* Image Container */}
            <div className="w-full md:w-1/2 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                initial={false}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.img
                src={feature.imgSrc}
                alt={feature.title}
                className="w-full h-[300px] object-cover"
                initial={false}
                animate={{
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Content Container */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-3">
                {feature.icon}
                <h3 className="text-2xl font-bold text-green-400">
                  {feature.title}
                </h3>
              </div>

              <p className="text-gray-300">{feature.description}</p>

              <Link href={feature.link}>
                <motion.button
                  className="mt-4 flex items-center gap-2 text-green-400 font-medium group/btn"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  Learn More
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </motion.button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
