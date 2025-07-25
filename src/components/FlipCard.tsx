import React from 'react';
import { motion } from 'framer-motion';
import './FlipCard.css';

interface FlipCardProps {
    frontContent?: React.ReactNode;
    backContent?: React.ReactNode;
    isFlipped?: boolean;
}

const FlipCard: React.FC<FlipCardProps> = ({ frontContent, backContent, isFlipped }) => {

  return (
    <div className="flipcard-container">
      {/* The inner motion.div is the element that actually rotates */}
      <motion.div
        className="flipcard-inner"
        initial={{ rotateY: 0 }} // Initial state: front face visible
        animate={{ rotateY: isFlipped ? 180 : 0 }} // Animate to 180deg (flipped) or 0deg (unflipped)
        transition={{ duration: 0.6, ease: "easeInOut" }} // Smooth transition with a duration
        style={{ transformStyle: 'preserve-3d' }} // Ensures children maintain their 3D position during rotation
      >
        {/* Front face of the card */}
        <div className="flipcard-face flipcard-front">
          {frontContent}
        </div>

        {/* Back face of the card */}
        <div className="flipcard-face flipcard-back">
          {backContent}
        </div>
      </motion.div>
    </div>
  );
};

export default FlipCard;