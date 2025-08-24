import ActivitiesCarousel from './ActivitiesCarousel';

export default function Activities({ packages }) {
  console.log("Packages data:", packages);
  

  const contactNumber = {
    Phone: "+1234567890" 
  };

  return (
    <div>
      <ActivitiesCarousel 
        packages={packages} 
        loading={false} 
        contactNumber={contactNumber} 
      />
    </div>
  );
}