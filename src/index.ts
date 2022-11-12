import express from 'express'
export const app = express()
const port = 3003
const jsonBody = express.json()
app.use(jsonBody)
const db = {
    cars: [{id: 1, name: 'Vesta'},
        {id: 2, name: 'Granta'},
        {id: 3, name: 'Niva'},
        {id: 4, name: 'Kalina'}]
}
app.get('/', (req, res) => {
    res.send({message: 'Hello World!'})
})
app.get('/cars', (req, res) => {
    res.json(db.cars)
})

app.get('/cars/:id', (req, res) => {
    const foundCars = db.cars.find(c => c.id === +req.params.id);
    if(!foundCars){
        res.sendStatus(404);
        return;
    }
    res.json(foundCars);

})

app.post('/cars', (req, res) => {
    const car = {
        id: Number(new Date()),
        name: req.body.name
    };
    db.cars.push(car)
    res.status(201).json(car);
})
app.delete('/cars/:id', (req, res) => {
    for(let c = 0; c <  db.cars.length; c++ )
        if(db.cars[c].id === Number(req.params.id)){
            db.cars.splice(c, 1);
            c = db.cars.length + c;
            res.sendStatus(204);
        }
    res.sendStatus(404);

})
app.put('/cars/:id', (req, res) => {
    if(!req.body.name){
        res.sendStatus(400);
        return;
    }
    const foundCars = db.cars.find(c => c.id === +req.params.id);
    if(!foundCars){
        res.sendStatus(404);
        return;
    }
    foundCars.name =  req.body.name;
    res.sendStatus(204);
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



const resolutions = [ 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160' ];
app.post('/videos', (req, res) => {
    const titleReq = req.body.title;
    const authorReq = req.body.author;
    const availableResolutionsReq = req.body.availableResolutions;
    if(!titleReq || typeof titleReq === "string" || titleReq.length > 40){
        res.status(400).send({
            message: "bad title",
            field: "title"
        });
        return;
    }
    if(!authorReq || typeof authorReq === "string" || authorReq.length > 20){
        res.status(400).send({
            message: "bad author",
            field: "author"
        });
        return;
    }
    const newVideo = {
        id: Number(new Date()),
        title: titleReq,
        author: authorReq,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: '',
        publicationDate: '',
        availableResolutions: null
    }
    let resolutionFlag = true;
    if(availableResolutionsReq){
        for(const resolutionReq of availableResolutionsReq)
            for(const resolutionRigth of resolutions)
                if(resolutionReq !== resolutionRigth)
                    resolutionFlag = false;
        if(resolutionFlag){
            newVideo.availableResolutions = availableResolutionsReq;
            res.status(201).json(newVideo);
            db.videos.push(newVideo);
            return;
        }
        else {
            res.status(400).send({
                message: "bad resolutions",
                field: "availableResolutions"
            });
            return;
        }
    }

})