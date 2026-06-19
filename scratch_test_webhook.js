async function run() {
  const payload = {
    type: 'INSERT',
    table: 'notifications',
    record: {
      title: 'TESTE SCRIPT',
      body: 'Checando se a edge function responde.',
      icon: '/Logo.png',
      url: '/'
    }
  };

  const res = await fetch('https://avjcjgsosfewukkdsgri.supabase.co/functions/v1/send-push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2amNqZ3Nvc2Zld3Vra2RzZ3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MzY0NzQsImV4cCI6MjA5NzMxMjQ3NH0.WZAtYIWfIRqgkqgI4FgxQ6Zjiwj6j2asTez5GRWYxII'
    },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Body:', text);
}

run();
