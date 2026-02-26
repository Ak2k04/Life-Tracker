const { Client } = require('pg');
const c = new Client('postgresql://postgres:amaks@localhost:5432/lifedashboard');
c.connect()
    .then(() => c.query('TRUNCATE TABLE habit_completions;'))
    .then(() => {
        console.log('SUCCESS');
        c.end();
    })
    .catch(console.error);
