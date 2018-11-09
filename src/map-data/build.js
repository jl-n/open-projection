var shapefile = require("shapefile");
const fs = require('fs');

shapefile.read("ne_110m_admin_0_countries")
  .then(file => {
    console.log(file)
    fs.writeFile("geojson.js", 'export default '+JSON.stringify(file), (err) =>  {
        if(err) return console.log(err);
        console.log("The file was saved!");
    });
  }).catch(error => console.error(error.stack));
