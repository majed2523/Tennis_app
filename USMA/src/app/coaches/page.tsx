'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import {
  Calendar,
  Star,
  Award,
  Mail,
  Phone,
  Users,
  TrendingUp,
} from 'lucide-react';
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
  DialogFooter,
} from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

const coaches = [
  {
    id: 1,
    name: 'Benzagota Jaber',
    image: '/assets/jaber.jpg',
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
    achievements: [
      'Coached 3 national champions',
      'Former ATP Tour player',
      'Tennis Federation Excellence Award',
    ],
    education: 'Sports Science, University of Tennis',
    contact: {
      email: 'jaber@tennisclub.com',
      phone: '+1 (555) 123-4567',
    },
    schedule: [
      { day: 'Monday', hours: '9:00 AM - 5:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 5:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 5:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 5:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 5:00 PM' },
    ],
  },
  {
    id: 2,
    name: 'Akrem Boukhatem',
    image: '/assets/akrem.jpg',
    role: 'Youth Development Coach',
    specialties: ['Junior Training', 'Fundamentals', 'Mental Game'],
    experience: '10+ years',
    rating: 4.8,
    reviews: 98,
    certifications: ['ITF Level 2', 'Youth Development Specialist'],
    availability: 'Tue-Sat',
    bio: 'Passionate about developing young talent and building strong foundations. Focuses on making tennis fun while teaching proper technique and mental strength.',
    achievements: [
      'Developed 15+ junior champions',
      'Youth Coach of the Year 2022',
      'Junior Development Program Director',
    ],
    education: 'Physical Education, Sports Academy',
    contact: {
      email: 'akrem@tennisclub.com',
      phone: '+1 (555) 234-5678',
    },
    schedule: [
      { day: 'Tuesday', hours: '10:00 AM - 6:00 PM' },
      { day: 'Wednesday', hours: '10:00 AM - 6:00 PM' },
      { day: 'Thursday', hours: '10:00 AM - 6:00 PM' },
      { day: 'Friday', hours: '10:00 AM - 6:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 3:00 PM' },
    ],
  },
  {
    id: 3,
    name: 'Meneceur Abedelmadjed',
    image: '/assets/majed.jpg',
    role: 'Performance Coach',
    specialties: ['Fitness Training', 'Match Strategy', 'Serve Technique'],
    experience: '12+ years',
    rating: 4.7,
    reviews: 84,
    certifications: ['USTA High Performance', 'Strength & Conditioning'],
    availability: 'Mon-Sat',
    bio: 'Specializes in combining technical excellence with peak physical conditioning. Expert in serve development and match strategy.',
    achievements: [
      'Former Davis Cup team coach',
      'Certified strength & conditioning expert',
      'Advanced serve technique specialist',
    ],
    education: 'Sports Science & Kinesiology',
    contact: {
      email: 'majed@tennisclub.com',
      phone: '+1 (555) 345-6789',
    },
    schedule: [
      { day: 'Monday', hours: '8:00 AM - 4:00 PM' },
      { day: 'Tuesday', hours: '8:00 AM - 4:00 PM' },
      { day: 'Wednesday', hours: '8:00 AM - 4:00 PM' },
      { day: 'Thursday', hours: '8:00 AM - 4:00 PM' },
      { day: 'Friday', hours: '8:00 AM - 4:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 1:00 PM' },
    ],
  },
];

export default function CoachesPage() {
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [bookingCoach, setBookingCoach] = useState(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isCoachDetailOpen, setIsCoachDetailOpen] = useState(false);

  const aboutSectionRef = useRef(null);
  const teamSectionRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleBookSession = (coach) => {
    setBookingCoach(coach);
    setIsBookingDialogOpen(true);
  };

  const handleViewCoachDetails = (coach) => {
    setSelectedCoach(coach);
    setIsCoachDetailOpen(true);
  };

  const filteredCoaches =
    activeTab === 'all'
      ? coaches
      : coaches.filter((coach) =>
          coach.specialties.some((specialty) =>
            specialty.toLowerCase().includes(activeTab.toLowerCase())
          )
        );

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[60vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with clearer display */}
        <div className="absolute inset-0 bg-[url('/assets/download.jpeg')] bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold mb-4 text-white"
          >
            Meet Our <span className="text-club-red">Expert Coaches</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto mb-8"
          >
            Train with certified professionals who will help you reach your full
            potential
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              className="bg-club-red hover:bg-club-red/90 text-white px-6 py-2"
              onClick={() => scrollToSection(teamSectionRef)}
            >
              Meet The Team
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => scrollToSection(aboutSectionRef)}
            >
              About Our Program
            </Button>
          </motion.div>
        </div>

        {/* Animated decorative element */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        />
      </motion.section>

      {/* About Our Coaching Program */}
      <section ref={aboutSectionRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Our Coaching Philosophy
            </h2>
            <div className="w-20 h-1 bg-club-red mx-auto mb-6"></div>
            <p className="text-gray-600 mb-8">
              At Tennis Club, we believe in a holistic approach to tennis
              development. Our coaching program is designed to nurture players
              of all levels, from beginners to advanced competitors. We focus on
              technical skills, tactical awareness, physical conditioning, and
              mental strength.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-club-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-club-red" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Certified Experts
                </h3>
                <p className="text-gray-600">
                  All our coaches are certified professionals with extensive
                  playing and coaching experience.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-club-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-club-red" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Personalized Approach
                </h3>
                <p className="text-gray-600">
                  We tailor our coaching methods to each player's unique needs,
                  goals, and learning style.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-club-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-club-red" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Continuous Improvement
                </h3>
                <p className="text-gray-600">
                  We track progress and provide regular feedback to ensure
                  consistent development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coach Filtering */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Find the Perfect Coach
            </h2>
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-club-red data-[state=active]:text-white"
                >
                  All Coaches
                </TabsTrigger>
                <TabsTrigger
                  value="Professional"
                  className="data-[state=active]:bg-club-red data-[state=active]:text-white"
                >
                  Professional
                </TabsTrigger>
                <TabsTrigger
                  value="Junior"
                  className="data-[state=active]:bg-club-red data-[state=active]:text-white"
                >
                  Junior
                </TabsTrigger>
                <TabsTrigger
                  value="Fitness"
                  className="data-[state=active]:bg-club-red data-[state=active]:text-white"
                >
                  Fitness
                </TabsTrigger>
                <TabsTrigger
                  value="Mental"
                  className="data-[state=active]:bg-club-red data-[state=active]:text-white"
                >
                  Mental Game
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Coaches Grid */}
      <section ref={teamSectionRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Our Coaching Team
            </h2>
            <div className="w-20 h-1 bg-club-red mb-12"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCoaches.map((coach, index) => (
                <motion.div
                  key={coach.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                >
                  <Card className="bg-white border border-gray-200 overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden aspect-[4/3]">
                        <motion.img
                          src={coach.image}
                          alt={coach.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          initial={false}
                          whileHover={{ scale: 1.05 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-2xl font-bold text-white mb-1">
                            {coach.name}
                          </h3>
                          <p className="text-club-red font-medium">
                            {coach.role}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-gray-800">
                          {coach.rating}
                        </span>
                        <span className="text-gray-500">
                          ({coach.reviews} reviews)
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {coach.specialties.map((specialty, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="bg-club-red/10 text-club-red border-club-red/20 hover:bg-club-red/20"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-gray-600 line-clamp-3">
                          {coach.bio}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="px-6 py-4 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        <Calendar className="h-4 w-4 inline-block mr-2 text-club-red" />
                        Available {coach.availability}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-club-red text-club-red hover:bg-club-red/5"
                          onClick={() => handleViewCoachDetails(coach)}
                        >
                          Details
                        </Button>
                        <Button
                          className="bg-club-red hover:bg-club-red/90 text-white"
                          size="sm"
                          onClick={() => handleBookSession(coach)}
                        >
                          Book
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-16 bg-club-red text-white"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-white/80">Professional Coaches</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-white/80">Students Trained</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-white/80">Tournament Wins</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold mb-2">4.8</div>
                <div className="text-white/80">Average Rating</div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              What Our Students Say
            </h2>
            <div className="w-20 h-1 bg-club-red mx-auto mb-12"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "Coach Jaber transformed my game completely. His attention to
                  detail and personalized approach helped me win my first
                  tournament!"
                </p>
                <div className="font-semibold text-gray-800">Michael T.</div>
                <div className="text-sm text-gray-500">Advanced Player</div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "My kids love Coach Akrem's junior program. He makes learning
                  tennis fun while building solid fundamentals. Highly
                  recommended!"
                </p>
                <div className="font-semibold text-gray-800">Sarah K.</div>
                <div className="text-sm text-gray-500">Parent</div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "Coach Meneceur's fitness program took my endurance to another
                  level. I can now play intense matches without getting tired!"
                </p>
                <div className="font-semibold text-gray-800">David L.</div>
                <div className="text-sm text-gray-500">Competitive Player</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Improve Your Game?
            </h2>
            <p className="text-gray-600 mb-8">
              Book a session with one of our expert coaches today and take your
              tennis skills to the next level.
            </p>
            <Button className="bg-club-red hover:bg-club-red/90 text-white px-8 py-6 text-lg">
              Book a Session Now
            </Button>
          </div>
        </div>
      </section>

      {/* Coach Detail Dialog */}
      <Dialog open={isCoachDetailOpen} onOpenChange={setIsCoachDetailOpen}>
        <DialogContent className="max-w-3xl bg-white">
          {selectedCoach && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800">
                  {selectedCoach.name}
                </DialogTitle>
                <DialogDescription className="text-club-red font-medium">
                  {selectedCoach.role}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="md:col-span-1">
                  <div className="rounded-lg overflow-hidden mb-4">
                    <img
                      src={selectedCoach.image || '/placeholder.svg'}
                      alt={selectedCoach.name}
                      className="w-full h-auto object-cover"
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Contact Information
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-club-red mr-2" />
                        <span>{selectedCoach.contact.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-club-red mr-2" />
                        <span>{selectedCoach.contact.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Tabs defaultValue="about">
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger
                        value="about"
                        className="data-[state=active]:bg-club-red data-[state=active]:text-white"
                      >
                        About
                      </TabsTrigger>
                      <TabsTrigger
                        value="achievements"
                        className="data-[state=active]:bg-club-red data-[state=active]:text-white"
                      >
                        Achievements
                      </TabsTrigger>
                      <TabsTrigger
                        value="schedule"
                        className="data-[state=active]:bg-club-red data-[state=active]:text-white"
                      >
                        Schedule
                      </TabsTrigger>
                      <TabsTrigger
                        value="reviews"
                        className="data-[state=active]:bg-club-red data-[state=active]:text-white"
                      >
                        Reviews
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="about" className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Biography
                        </h3>
                        <p className="text-gray-600">{selectedCoach.bio}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Specialties
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCoach.specialties.map((specialty, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="bg-club-red/10 text-club-red border-club-red/20"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Certifications
                        </h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {selectedCoach.certifications.map((cert, i) => (
                            <li key={i}>{cert}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Experience
                        </h3>
                        <p className="text-gray-600">
                          {selectedCoach.experience}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Education
                        </h3>
                        <p className="text-gray-600">
                          {selectedCoach.education}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="achievements">
                      <h3 className="font-semibold text-gray-800 mb-4">
                        Key Achievements
                      </h3>
                      <ul className="space-y-3">
                        {selectedCoach.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start">
                            <Award className="h-5 w-5 text-club-red mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="schedule">
                      <h3 className="font-semibold text-gray-800 mb-4">
                        Weekly Availability
                      </h3>
                      <div className="space-y-2">
                        {selectedCoach.schedule.map((slot, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200"
                          >
                            <div className="font-medium text-gray-800">
                              {slot.day}
                            </div>
                            <div className="text-gray-600">{slot.hours}</div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="reviews">
                      <h3 className="font-semibold text-gray-800 mb-4">
                        Student Reviews
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center mb-2">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className="h-4 w-4 text-yellow-400 fill-yellow-400"
                                />
                              ))}
                            </div>
                            <span className="text-gray-600 text-sm">
                              2 weeks ago
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            "Coach {selectedCoach.name} is exceptional! Their
                            attention to detail and personalized approach has
                            improved my game tremendously."
                          </p>
                          <div className="text-sm font-medium text-gray-800">
                            Alex M.
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center mb-2">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className="h-4 w-4 text-yellow-400 fill-yellow-400"
                                />
                              ))}
                            </div>
                            <span className="text-gray-600 text-sm">
                              1 month ago
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            "I've been taking lessons for 6 months and my serve
                            has improved dramatically. Highly recommended!"
                          </p>
                          <div className="text-sm font-medium text-gray-800">
                            Jamie T.
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <DialogFooter className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsCoachDetailOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="bg-club-red hover:bg-club-red/90 text-white"
                  onClick={() => {
                    setIsCoachDetailOpen(false);
                    handleBookSession(selectedCoach);
                  }}
                >
                  Book a Session
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-md bg-white">
          {bookingCoach && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800">
                  Book a Session with {bookingCoach.name}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Choose your preferred date and time for your training session.
                </DialogDescription>
              </DialogHeader>

              <form className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="session-type">Session Type</Label>
                  <Select defaultValue="private">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">
                        Private Lesson (1 hour)
                      </SelectItem>
                      <SelectItem value="semi-private">
                        Semi-Private Lesson (2 people)
                      </SelectItem>
                      <SelectItem value="group">
                        Group Clinic (4-6 people)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" className="w-full" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Select defaultValue="9am">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9am">9:00 AM</SelectItem>
                      <SelectItem value="10am">10:00 AM</SelectItem>
                      <SelectItem value="11am">11:00 AM</SelectItem>
                      <SelectItem value="1pm">1:00 PM</SelectItem>
                      <SelectItem value="2pm">2:00 PM</SelectItem>
                      <SelectItem value="3pm">3:00 PM</SelectItem>
                      <SelectItem value="4pm">4:00 PM</SelectItem>
                      <SelectItem value="5pm">5:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Special Requests</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific areas you'd like to focus on?"
                    className="w-full"
                  />
                </div>
              </form>

              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsBookingDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-club-red hover:bg-club-red/90 text-white"
                  onClick={() => {
                    // Handle booking submission
                    setIsBookingDialogOpen(false);
                    // Show confirmation or redirect
                  }}
                >
                  Confirm Booking
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
