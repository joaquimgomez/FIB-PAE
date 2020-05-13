//import ComputerVisionEngine from './CVEngine.js';

const cv = require("opencv4nodejs");

cv.imreadAsync('./Test2.jpg', (err, mat) => {
  const CVE = require('./CVEngine.js');

  let responsesTypes = ['text', 'text', 'text', 'icons-checkbox',
								'text', 'icons-checkbox', 'normal-checkbox',
								'normal-checkbox', 'text']
  
  let cve = new CVE(mat, responsesTypes);
  
  let results = cve.run();

  Promise.all(results).then(values => {
    console.log(values);
  })
});


