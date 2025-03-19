'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calendar, Star } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';

const coaches = [
  {
    id: 1,
    name: 'Benzagota Jaber',
    image:
      '/assets/jaber.jpg',
    role: 'Head Coach',
    specialties: [
      'Professional Training',
      'Tournament Preparation',
      'Advanced Techniques',
    ],
    experience: '15+ years',
    rating: 4.9,
    reviews: 127,
    certifications: ['ATP Certified', 'ITF Level 3', 'National Champion'],
    availability: 'Mon-Fri',
    bio: 'Former ATP professional with extensive experience in developing championship-caliber players. Specialized in advanced technique refinement and tournament preparation.',
  },
  {
    id: 2,
    name: 'Akrem Boukhatem',
    image:
      '/assets/akrem.jpg',
    role: 'Youth Development Coach',
    specialties: ['Junior Training', 'Fundamentals', 'Mental Game'],
    experience: '10+ years',
    rating: 4.8,
    reviews: 98,
    certifications: ['ITF Level 2', 'Youth Development Specialist'],
    availability: 'Tue-Sat',
    bio: 'Passionate about developing young talent and building strong foundations. Focuses on making tennis fun while teaching proper technique and mental strength.',
  },
  {
    id: 3,
    name: 'Meneceur Abedelmadjed',
    image:
      '/assets/majed.jpg',
    role: 'Performance Coach',
    specialties: ['Fitness Training', 'Match Strategy', 'Serve Technique'],
    experience: '12+ years',
    rating: 4.7,
    reviews: 84,
    certifications: ['USTA High Performance', 'Strength & Conditioning'],
    availability: 'Mon-Sat',
    bio: 'Specializes in combining technical excellence with peak physical conditioning. Expert in serve development and match strategy.',
  },
];

export default function CoachesPage() {
  const [selectedCoach, setSelectedCoach] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[50vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('/assets/download.jpeg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold mb-4"
          >
            Meet Our <span className="text-green-400">Expert Coaches</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Train with certified professionals who will help you reach your full
            potential
          </motion.p>
        </div>

        {/* Animated decorative elements */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        />
      </motion.section>

      {/* Coaches Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coaches.map((coach, index) => (
            <motion.div
              key={coach.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 overflow-hidden group">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <motion.img
                      src={coach.image}
                      alt={coach.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      initial={false}
                      whileHover={{ scale: 1.1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {coach.name}
                      </h3>
                      <p className="text-green-400 font-medium">{coach.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-white">{coach.rating}</span>
                    <span className="text-gray-400">
                      ({coach.reviews} reviews)
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {coach.specialties.map((specialty, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-green-400/10 text-green-400 hover:bg-green-400/20"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-gray-300 line-clamp-3">{coach.bio}</p>
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-4 bg-gray-800/30 flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    <Calendar className="h-4 w-4 inline-block mr-2" />
                    Available {coach.availability}
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-green-400 hover:bg-green-500 text-gray-900">
                        Book Session
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white">
                          Book a Session with {coach.name}
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Choose your preferred date and time for your training
                          session.
                        </DialogDescription>
                      </DialogHeader>
                      {/* Add booking form here */}
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="bg-gray-800/50 py-16 mt-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-green-400 mb-2">15+</div>
              <div className="text-gray-400">Professional Coaches</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-green-400 mb-2">
                1000+
              </div>
              <div className="text-gray-400">Students Trained</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-green-400 mb-2">50+</div>
              <div className="text-gray-400">Tournament Wins</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-green-400 mb-2">4.8</div>
              <div className="text-gray-400">Average Rating</div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
