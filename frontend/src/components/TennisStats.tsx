"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const stats = [
  { value: 12, label: "Professional Courts", icon: "🎾" },
  { value: 25, label: "Expert Coaches", icon: "👨‍🏫" },
  { value: 1500, label: "Active Members", icon: "👥" },
  { value: 50, label: "Tournaments Yearly", icon: "🏆" },
]

export default function TennisStats() {
  return (
    <div className="py-16 bg-gray-800/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ stat, index }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="text-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="text-4xl mb-2"
        animate={{ scale: isHovered ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {stat.icon}
      </motion.div>
      <motion.div
        className="text-3xl md:text-4xl font-bold text-green-400"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
        viewport={{ once: true }}
      >
        <Counter from={0} to={stat.value} duration={2} />
      </motion.div>
      <motion.p
        className="text-gray-300 mt-1"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
        viewport={{ once: true }}
      >
        {stat.label}
      </motion.p>
    </motion.div>
  )
}

function Counter({ from, to, duration }) {
  const [count, setCount] = useState(from)

  useState(() => {
    let startTime
    let animationFrame

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * (to - from) + from))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount)
      }
    }

    animationFrame = requestAnimationFrame(updateCount)
    return () => cancelAnimationFrame(animationFrame)
  }, [from, to, duration])

  return <>{count}</>
}

