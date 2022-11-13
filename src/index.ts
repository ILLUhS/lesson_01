
import express from 'express';
export const app = express();
const port = process.env.PORT || 5000;
const jsonBody = express.json();
app.use(jsonBody);

type VideoType = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    createdAt: string;
    publicationDate: string;
    availableResolutions: string[] | null;
};
type dbType = {
    videos: VideoType[];
};
type errorsMessagesType = {
    message: string;
    field: string;
}
type errorsType = {
    errorsMessages: errorsMessagesType[];
}
const db: dbType = {
    videos: []
};
//массив валидных разрешений
const resolutions = [ 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160' ];
//POST
app.post('/videos', (req, res) => {
    const titleReq = req.body.title;
    const authorReq = req.body.author;
    const availableResolutionsReq = req.body.availableResolutions;
    const errors: errorsType = {errorsMessages: []};
    let errorFlag = false;
    if(!titleReq || typeof titleReq !== "string" || titleReq.length > 40){
        errors.errorsMessages.push({
            message: "bad title",
            field: "title"
        });
        errorFlag = true;
    }
    if(!authorReq || typeof authorReq !== "string" || authorReq.length > 20){
        errors.errorsMessages.push({
            message: "bad author",
            field: "author"
        });
        errorFlag = true;
    }
    const newVideo = {
        id: Number(new Date()),
        title: String(titleReq),
        author: String(authorReq),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toISOString(),
        availableResolutions: null
    }
    if(availableResolutionsReq){
        for(let i: number = 0; i < availableResolutionsReq.length; i++)
            if(!resolutions.includes(availableResolutionsReq[i])){
                errors.errorsMessages.push({
                    message: "bad resolutions",
                    field: "availableResolutions"
                });
                errorFlag = true;
                i = availableResolutionsReq.length;
            }
        newVideo.availableResolutions = availableResolutionsReq;
    }
    if(errorFlag){
        res.status(400).json(errors);
        return;
    }
    db.videos.push(newVideo);
    res.status(201).json(newVideo);
})
//Удаление всех данных
app.delete('/testing/all-data', (req, res) => {

    db.videos = [];
    res.sendStatus(204);

})

app.get('/', (req, res) => {
    res.status(200).send('Hello');
    return;
})

//GET all
app.get('/videos', (req, res) => {
    res.status(200).json(db.videos);
    return;
})
//GET on id
app.get('/videos/:id', (req, res) => {
    const foundVideo = db.videos.find(v => v.id === Number(req.params.id));
    if(!foundVideo) {
        res.sendStatus(404);
        return;
    }
    res.status(200).json(foundVideo);
})
//PUT update on id
app.put('/videos/:id', (req, res) => {
    const foundVideoUpdate = db.videos.find(v => v.id === Number(req.params.id));
    if(!foundVideoUpdate) {
        res.sendStatus(404);
        return;
    }
    const titleReqUpdate = req.body.title;
    const authorReqUpdate = req.body.author;
    const availableResolutionsReqUpdate = req.body.availableResolutions;
    const canBeDownloadedUpdate = req.body.canBeDownloaded;
    const minAgeRestrictionUpdate = req.body.minAgeRestriction;
    const publicationDateUpdate = req.body.publicationDate;
    const errors: errorsType = {errorsMessages: []};
    let errorFlag = false;
    if(!titleReqUpdate || typeof titleReqUpdate !== "string" || titleReqUpdate.length > 40){
        errors.errorsMessages.push({
            message: "bad title",
            field: "title"
        });
        errorFlag = true;
    }
    foundVideoUpdate.title = String(titleReqUpdate);
    if(!authorReqUpdate || typeof authorReqUpdate !== "string" || authorReqUpdate.length > 20){
        errors.errorsMessages.push({
            message: "bad author",
            field: "author"
        });
        errorFlag = true;
    }
    foundVideoUpdate.author = String(authorReqUpdate);
    if(canBeDownloadedUpdate !== undefined){
        if(typeof canBeDownloadedUpdate !== "boolean"){
            errors.errorsMessages.push({
                message: "bad field",
                field: "canBeDownloaded"
            });
            errorFlag = true;
        }
        foundVideoUpdate.canBeDownloaded = canBeDownloadedUpdate;
    }
    if(isNaN(minAgeRestrictionUpdate)){
        foundVideoUpdate.minAgeRestriction = minAgeRestrictionUpdate;
    }
    else if(minAgeRestrictionUpdate){
        if(typeof minAgeRestrictionUpdate !== "number" || minAgeRestrictionUpdate < 1 || minAgeRestrictionUpdate > 18){
            errors.errorsMessages.push({
                message: "bad field",
                field: "minAgeRestriction"
            });
            errorFlag = true;
        }
        foundVideoUpdate.minAgeRestriction = minAgeRestrictionUpdate;
    }
    const publicationDateUpdateCheck = new Date(Date.parse(publicationDateUpdate)).toISOString();
    if(publicationDateUpdate){
        if(typeof publicationDateUpdate !== "string" || publicationDateUpdate !== publicationDateUpdateCheck){
            errors.errorsMessages.push({
                message: "bad field",
                field: "canBeDownloaded"
            });
            errorFlag = true;
        }
        foundVideoUpdate.publicationDate = publicationDateUpdate;
    }
    if(availableResolutionsReqUpdate){
        for(let i: number = 0; i < availableResolutionsReqUpdate.length; i++)
            if(!resolutions.includes(availableResolutionsReqUpdate[i])){
                errors.errorsMessages.push({
                    message: "bad resolutions",
                    field: "availableResolutions"
                });
                errorFlag = true;
                i = availableResolutionsReqUpdate.length;
            }
        foundVideoUpdate.availableResolutions = availableResolutionsReqUpdate;
    }
    if(errorFlag){
        res.status(400).json(errors);
        return;
    }
    res.sendStatus(204);
})
//DELETE on id
app.delete('/videos/:id', (req, res) => {
    const foundVideoDelete = db.videos.find(v => v.id === Number(req.params.id));
    if(!foundVideoDelete) {
        res.sendStatus(404);
        return;
    }
    db.videos = db.videos.splice(db.videos.indexOf(foundVideoDelete), 1);
    res.sendStatus(204);
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})