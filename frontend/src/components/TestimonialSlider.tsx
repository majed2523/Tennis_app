'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Amateur Player',
    image: '/placeholder.svg?height=80&width=80',
    quote:
      "The coaching staff here transformed my game. I've improved more in 3 months than I did in 3 years on my own!",
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Club Member',
    image: '/placeholder.svg?height=80&width=80',
    quote:
      "The courts are always in perfect condition, and the community is so welcoming. It's become my second home.",
    rating: 5,
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Junior Player',
    image: '/placeholder.svg?height=80&width=80',
    quote:
      'The youth program here is amazing. My confidence has grown both on and off the court.',
    rating: 4,
  },
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 5000);

    return () => clearTimeout(timer);
  }, [current]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 relative">
      <div className="relative overflow-hidden h-80">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-green-400">
            <img
              src={testimonials[current].image || '/placeholder.svg'}
              alt={testimonials[current].name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < testimonials[current].rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-400'
                }`}
              />
            ))}
          </div>

          <blockquote className="text-xl italic text-gray-200 mb-4">
            "{testimonials[current].quote}"
          </blockquote>

          <div>
            <h4 className="font-bold text-green-400">
              {testimonials[current].name}
            </h4>
            <p className="text-gray-400 text-sm">
              {testimonials[current].role}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-full"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-full"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
            className={`w-3 h-3 rounded-full ${
              index === current
                ? 'bg-green-400'
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
