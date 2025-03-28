'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { Button } from '../components/ui/button';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  Users,
  Trophy,
  MapPin,
  Mail,
  Phone,
  Clock,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const locationRef = useRef(null);
  const contactRef = useRef(null);
  const isLocationInView = useInView(locationRef, { once: true, amount: 0.3 });
  const isContactInView = useInView(contactRef, { once: true, amount: 0.3 });

  useEffect(() => {
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
      const userData = authService.getCurrentUser();
      if (userData?.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (userData?.role === 'coach') {
        router.push('/coach/dashboard');
      } else {
        router.push('/player/dashboard');
      }
    }
  }, [router]);

  const scrollToSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop - 100,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-md bg-club-red flex items-center justify-center mr-3">
              <span className="text-white font-bold">TC</span>
            </div>
            <h1 className="text-xl font-bold text-club-dark-grey">
              Tennis Club
            </h1>
          </div>

          <nav className="hidden md:flex space-x-8">
            <button className="text-gray-600 hover:text-club-red transition">
              Home
            </button>
            <button className="text-gray-600 hover:text-club-red transition">
              Coaches
            </button>
            <button className="text-gray-600 hover:text-club-red transition">
              Schedule
            </button>
            <button
              onClick={() => scrollToSection(locationRef)}
              className="text-gray-600 hover:text-club-red transition"
            >
              Location
            </button>
            <button
              onClick={() => scrollToSection(contactRef)}
              className="text-gray-600 hover:text-club-red transition"
            >
              Contact
            </button>
          </nav>

          <div>
            <Link href="/login">
              <Button className="bg-club-red hover:bg-club-dark-red text-white">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl"
        >
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-club-red">Tennis Club</span>
            <br />
            <span className="text-club-dark-grey">Management</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A comprehensive platform for tennis clubs to manage coaches,
            players, lessons, and teams.
          </p>

          <Link href="/login">
            <Button className="bg-club-red hover:bg-club-dark-red text-white text-lg px-8 py-6 rounded-md">
              Get Started
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl"
        >
          {/* Player Card */}
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="bg-club-red/10 p-3 rounded-lg mr-4">
                <Calendar className="h-8 w-8 text-club-red" />
              </div>
              <h2 className="text-xl font-bold text-club-red">For Players</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Enhance your tennis experience with our comprehensive player
              features. Book private lessons with professional coaches, track
              your progress, and join competitive teams.
            </p>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-club-red mr-2"></div>
                Easy lesson scheduling
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-club-red mr-2"></div>
                Performance tracking
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-club-red mr-2"></div>
                Team participation
              </li>
            </ul>
            <div className="mt-auto">
              <Link href="/registration">
                <Button
                  variant="outline"
                  className="border-club-red text-club-red hover:bg-club-red/10"
                >
                  Register as Player
                </Button>
              </Link>
            </div>
          </div>

          {/* Coach Card */}
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="bg-club-red/10 p-3 rounded-lg mr-4">
                <Users className="h-8 w-8 text-club-red" />
              </div>
              <h2 className="text-xl font-bold text-club-red">For Coaches</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Streamline your coaching workflow with our powerful tools. Manage
              your availability, organize lessons, and lead teams to success
              with our comprehensive coaching platform.
            </p>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-club-red mr-2"></div>
                Availability management
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-club-red mr-2"></div>
                Student progress tracking
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-club-red mr-2"></div>
                Team coaching tools
              </li>
            </ul>
            <div className="mt-auto">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-club-red text-club-red hover:bg-club-red/10"
                >
                  Coach Login
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Facilities Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 w-full max-w-5xl"
        >
          <h2 className="text-3xl font-bold text-club-dark-grey mb-8 text-center">
            Our Facilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md text-center">
              <div className="bg-club-red/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-club-red" />
              </div>
              <h3 className="text-lg font-semibold text-club-dark-grey mb-2">
                12 Premium Courts
              </h3>
              <p className="text-gray-600">
                State-of-the-art courts with professional-grade surfaces
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md text-center">
              <div className="bg-club-red/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-club-red" />
              </div>
              <h3 className="text-lg font-semibold text-club-dark-grey mb-2">
                Professional Coaches
              </h3>
              <p className="text-gray-600">
                Expert coaching staff with international experience
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md text-center">
              <div className="bg-club-red/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-club-red" />
              </div>
              <h3 className="text-lg font-semibold text-club-dark-grey mb-2">
                Regular Tournaments
              </h3>
              <p className="text-gray-600">
                Competitive events for players of all skill levels
              </p>
            </div>
          </div>
        </motion.div>

        {/* Location Section */}
        <motion.div
          ref={locationRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 w-full max-w-5xl"
        >
          <h2 className="text-3xl font-bold text-club-dark-grey mb-8 text-center">
            Our Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isLocationInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg border border-gray-200 shadow-md"
            >
              <h3 className="text-xl font-bold text-club-dark-grey mb-6">
                Find Us
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-club-red mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-club-dark-grey font-medium">Address</p>
                    <p className="text-gray-600">123 Tennis Court Lane</p>
                    <p className="text-gray-600">New York, NY 10001</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-club-red mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-club-dark-grey font-medium">Phone</p>
                    <p className="text-gray-600">(123) 456-7890</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-club-red mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-club-dark-grey font-medium">Email</p>
                    <p className="text-gray-600">info@tennisclub.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-club-red mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-club-dark-grey font-medium">Hours</p>
                    <p className="text-gray-600">
                      Monday - Friday: 6:00 AM - 10:00 PM
                    </p>
                    <p className="text-gray-600">
                      Saturday - Sunday: 7:00 AM - 8:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isLocationInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="h-[350px] rounded-lg overflow-hidden"
            >
              {/* Map placeholder */}
              <div className="w-full h-full bg-gray-100 border border-gray-200 rounded-lg shadow-md flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-club-red mx-auto mb-4" />
                  <p className="text-club-dark-grey text-lg">Interactive Map</p>
                  <p className="text-gray-600">Map would be displayed here</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          ref={contactRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24 w-full max-w-5xl mb-16"
        >
          <h2 className="text-3xl font-bold text-club-dark-grey mb-8 text-center">
            Contact Us
          </h2>
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-club-dark-grey mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-club-dark-grey focus:outline-none focus:ring-2 focus:ring-club-red"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-club-dark-grey mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-club-dark-grey focus:outline-none focus:ring-2 focus:ring-club-red"
                    placeholder="Your email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-club-dark-grey mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-club-dark-grey focus:outline-none focus:ring-2 focus:ring-club-red"
                  placeholder="Subject"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-club-dark-grey mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-club-dark-grey focus:outline-none focus:ring-2 focus:ring-club-red"
                  placeholder="Your message"
                ></textarea>
              </div>

              <Button className="w-full bg-club-red hover:bg-club-dark-red text-white py-3">
                Send Message
              </Button>
            </form>
          </div>
        </motion.div>
      </main>

      <footer className="py-8 px-8 bg-club-red text-white">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center mr-2">
                <span className="text-club-red font-bold text-xs">TC</span>
              </div>
              <span className="text-white font-semibold">Tennis Club</span>
            </div>

            <div className="flex space-x-6">
              <Link
                href="/about"
                className="text-white hover:text-white/80 transition"
              >
                About
              </Link>
              <Link
                href="/coaches"
                className="text-white hover:text-white/80 transition"
              >
                Coaches
              </Link>
              <Link
                href="/schedule"
                className="text-white hover:text-white/80 transition"
              >
                Schedule
              </Link>
              <Link
                href="/contact"
                className="text-white hover:text-white/80 transition"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center text-white/80 text-sm">
            &copy; {new Date().getFullYear()} Tennis Club Management. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
