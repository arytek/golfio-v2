const fs = require('fs');
const path = require('path');

function loadCourse(name) {
  const file = path.join(__dirname, '..', 'courses', name + '.json');
  const data = fs.readFileSync(file, 'utf8');
  return JSON.parse(data);
}

module.exports = { loadCourse };
