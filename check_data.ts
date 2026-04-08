import axios from 'axios';

async function test() {
  try {
    const res = await axios.get('http://localhost:3000/trips/active');
    console.log('Backend Data Sample:', JSON.stringify(res.data[0], null, 2));
  } catch (e) {
    console.error('Failed to fetch:', e.message);
  }
}

test();
