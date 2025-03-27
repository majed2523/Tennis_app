'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, ExternalLink, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export default function LocationSection() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-green-400">Visit</span> Our Club
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Located in the heart of Annaba, USMA Tennis Club offers world-class
            facilities in a beautiful setting.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-xl"
          >
            <div
              className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-10 transition-opacity duration-500"
              style={{ opacity: isMapLoaded ? 0 : 1 }}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.5276173774146!2d7.7553!3d36.9025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDU0JzA5LjAiTiA3wrA0NScxOS4xIkU!5e0!3m2!1sen!2sus!4v1615481!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsMapLoaded(true)}
              className="z-0"
            ></iframe>

            {/* Map Overlay */}
            <div className="absolute top-4 left-4 z-20">
              <div className="bg-gray-900/80 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <MapPin className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-green-400 mb-6">
                  USMA Tennis Club
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-400/20 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Address</h4>
                      <p className="text-gray-400">VPPX+MW6, Annaba, Algérie</p>
                      <p className="text-gray-400">Stade 19 Mai 1956, Annaba</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-400/20 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        Opening Hours
                      </h4>
                      <p className="text-gray-400">
                        Monday - Friday: 8:00 AM - 10:00 PM
                      </p>
                      <p className="text-gray-400">
                        Saturday - Sunday: 9:00 AM - 8:00 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-400/20 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Contact</h4>
                      <p className="text-gray-400">Phone: +213 38 86 61 54</p>
                      <p className="text-gray-400">
                        Email: contact@usmatennis.dz
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-8">
                    <Button className="bg-green-400 hover:bg-green-500 text-gray-900">
                      <Navigation className="mr-2 h-4 w-4" />
                      Get Directions
                    </Button>
                    <Button
                      variant="outline"
                      className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 bg-yellow-400/10 rounded-lg p-4 border border-yellow-400/20">
              <div className="flex items-start gap-3">
                <div className="text-yellow-400 mt-1">
                  <ExternalLink className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-1">
                    Transportation Tip
                  </h4>
                  <p className="text-gray-300 text-sm">
                    The club is easily accessible by public transportation. Bus
                    lines 2, 5, and 8 stop within a 5-minute walk from the club
                    entrance.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
