import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function MotionInView({
  children,
  className,
  delay = 0,
  y = 14,
  once = true,
}: any) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-20% 0px -20% 0px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
