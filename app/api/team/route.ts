// Simplified team API for radio community
export async function GET() {
  // For this demo, we return a simple radio community team structure
  const team = {
    id: 'radio-community',
    name: 'Radio Community',
    members: [],
    subscription: null
  };
  return Response.json(team);
}
