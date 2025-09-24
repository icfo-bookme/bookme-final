import { FaPhone, FaWhatsapp } from 'react-icons/fa';

const SimpleCTA = () => {
  return (
    <div className='py-5 '>
    <section className="py-12 max-w-6xl mx-auto rounded-lg px-4 text-center" style={{ background: "linear-gradient(90deg, #313881, #0678B4)" }}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Need Help With Your Booking?
        </h2>
        <p className="text-blue-100 mb-8">
          Our travel experts are here to help you plan your perfect trip
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a 
            href="tel:0196777677" 
            className="bg-white text-blue-800 font-medium py-3 px-6 rounded-lg inline-flex items-center justify-center hover:bg-blue-50 transition-colors"
          >
            <FaPhone className="mr-2" />
            Call Now: 0196777677
          </a>
          
          <a 
            href="https://wa.me/880196777677" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-green-600 text-white font-medium py-3 px-6 rounded-lg inline-flex items-center justify-center hover:bg-green-700 transition-colors"
          >
            <FaWhatsapp size={25} className="mr-2" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </section></div>
  );
};

export default SimpleCTA;