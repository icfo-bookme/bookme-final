export default async function getActivities( ) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/activities`);
  const activities = await res.json();
  return activities;
}