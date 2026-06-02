const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envText = fs.readFileSync('.env.local', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

supabase.from('properties').insert([{
  title: 'Test Temp Address/City',
  price: 10,
  address: '14:00',
  city: '12:00',
  status: 'pending',
  owner_name: 'Test Owner',
  owner_phone: '123456',
  location: 'دمشق',
  governorate: 'دمشق',
  type: 'شقة'
}]).select('*').then(({ data, error }) => {
  console.log('Insert Result:', data);
  console.log('Insert Error:', error);
  if (data && data[0]) {
    // Delete the test row
    supabase.from('properties').delete().eq('id', data[0].id).then(console.log);
  }
});
