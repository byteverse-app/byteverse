import { useState } from 'react';
import ByteCourseModal from './ByteCourseModal';

export default function ModesSection(){
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="modes" className="container-narrow py-20">
      <div className="text-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Try Example Course
        </button>
      </div>

      {/* Course Modal */}
      <ByteCourseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
}
