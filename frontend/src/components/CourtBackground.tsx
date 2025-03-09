"use client"

import { motion } from "framer-motion"

export default function CourtBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Tennis court background */}
      <div className="absolute inset-0 bg-gray-900">
        {/* Court lines */}
        <motion.div
          className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 transform -translate-y-1/2"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />

        <motion.div
          className="absolute top-0 bottom-0 left-1/2 w-1 bg-white/10 transform -translate-x-1/2"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
        />

        {/* Service boxes */}
        <motion.div
          className="absolute top-1/4 left-1/4 right-1/2 bottom-3/4 border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />

        <motion.div
          className="absolute top-1/4 left-1/2 right-1/4 bottom-3/4 border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
        />

        <motion.div
          className="absolute top-3/4 left-1/4 right-1/2 bottom-1/4 border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        />

        <motion.div
          className="absolute top-3/4 left-1/2 right-1/4 bottom-1/4 border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
        />

        {/* Court outer lines */}
        <motion.div
          className="absolute top-[15%] left-[15%] right-[15%] bottom-[15%] border-2 border-white/10"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />

        {/* Net */}
        <motion.div
          className="absolute top-[15%] bottom-[15%] left-1/2 w-0.5 bg-white/20 transform -translate-x-1/2"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-gray-900/80" />
      </div>
    </div>
  )
}

