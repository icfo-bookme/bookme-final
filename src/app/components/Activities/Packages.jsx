import ActivitiesCarousel from './ActivitiesCarousel';

export default function Activities({ packages,property_id }) {
  const contactNumber = {
    Phone: "+1234567890" 
  };

  return (
    <div>
      <ActivitiesCarousel 
        packages={packages} 
        property_id={property_id}
        loading={false} 
        contactNumber={contactNumber} 
      />
    </div>
  );
}