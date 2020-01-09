const express = require('express')
const app = express()
const axios = require('axios')
const bodyParser = require('body-parser')
const port = process.env.PORT||3000
app.use(bodyParser({extended:true,JSON:true}))
const Distance = require('geo-distance');

const information=async (obj,currentlat,cuurentlong)=>{

    var ansObj=[];

    (obj.results).forEach(element => {
        let destlat=element.geometry.location.lat;
        let destlong=element.geometry.location.lng
        var from = {
            lat: currentlat,
            lon: cuurentlong
        };
        var to = {
            lat: destlat,
            lon: destlong
        };
        var distanceobj = Distance.between(from, to);
        var km=distanceobj.human_readable().distance
    
        let X = Math.cos(destlat*Math.PI/180) *Math.sin((destlong-cuurentlong)*Math.PI/180) ;
        let Y = Math.cos(currentlat*Math.PI/180) * Math.sin(destlat*Math.PI/180)   - Math.sin(currentlat*Math.PI/180)  * Math.cos(destlat*Math.PI/180)  * Math.cos((destlong-cuurentlong)*Math.PI/180) ;

        let degrees = (Math.atan2(X, Y)) *180 / Math.PI ;

        if(degrees<0)
        degrees=degrees+360;

        ansObj.push({
            name:element.name,
            icon:element.icon,
        // opening_hours:opening_status,///////////
            degrees,
            distance:km,
        })
  });
  
return ansObj;
}
app.get('/locationDetails',async (req,res)=>{
    const lat = req.query.lat
    const long = req.query.long
    const key = req.query.key
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAhpthFZ1y-ZkFZbuRpEndAaB148x0HH_s
    &radius=2000&location=${lat},${long}&keyword=${key}`
    const re = await axios.get(url)
    information(re.data,lat,long).then((val)=>{
        res.send(val)
    })
    
})

app.listen(port,()=>{
    console.log(`Server is up at Port ${port}`)
})