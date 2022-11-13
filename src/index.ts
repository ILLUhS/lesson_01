// @ts-nocheck
import express from 'express'
export const app = express()
const port = 3003
const jsonBody = express.json()
app.use(jsonBody)

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

const db = {
    videos: Array<VideoType>
}
//массив валидных разрешений
const resolutions = [ 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160' ];
//POST
app.post('/videos', (req, res) => {
    const titleReq = req.body.title;
    const authorReq = req.body.author;
    const availableResolutionsReq = req.body.availableResolutions;
    if(!titleReq || typeof titleReq === "string" || titleReq.length > 40){
        res.status(400).send({
            "errorsMessages":
                [{
                    message: "bad title",
                    field: "title"
                }]
        });
        return;
    }
    if(!authorReq || typeof authorReq === "string" || authorReq.length > 20){
        res.status(400).send({
            "errorsMessages":
                [{
                    message: "bad author",
                    field: "author"
                }]
        });
        return;
    }
    const newVideo = {
        id: Number(new Date()),
        title: String(titleReq),
        author: String(authorReq),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date(),
        publicationDate: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toISOString(),
        availableResolutions: null
    }
    if(availableResolutionsReq){
        let resolutionFlag = true;
        for(const resolutionReq of availableResolutionsReq)
            for(const resolutionRigth of resolutions)
                if(resolutionReq !== resolutionRigth)
                    resolutionFlag = false;
        if(resolutionFlag)
            newVideo.availableResolutions = availableResolutionsReq;
        else {
            res.status(400).send({
                "errorsMessages":
                    [{
                        message: "bad resolutions",
                        field: "availableResolutions"
                    }]
            });
            return;
        }
    }
    db.videos.push(newVideo);
    res.status(201).json(newVideo);
})
//Удаление всех данных
app.delete('/testing/all-data', (req, res) => {

    db.videos = [];
    res.sendStatus(204);

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
    if(!titleReqUpdate || typeof titleReqUpdate === "string" || titleReqUpdate.length > 40){
        res.status(400).send({
            "errorsMessages":
                [{
                    message: "bad title",
                    field: "title"
                }]
        });
        return;
    }
    foundVideoUpdate.title = String(titleReqUpdate);
    if(!authorReqUpdate || typeof authorReqUpdate === "string" || authorReqUpdate.length > 20){
        res.status(400).send({
            "errorsMessages":
                [{
                    message: "bad author",
                    field: "author"
                }]
        });
        return;
    }
    foundVideoUpdate.author = String(authorReqUpdate);
    if(canBeDownloadedUpdate){
        if(canBeDownloadedUpdate !== "boolean"){
            res.status(400).send({
                "errorsMessages":
                    [{
                        message: "bad field",
                        field: "canBeDownloaded"
                    }]
            });
            return;
        }
        foundVideoUpdate.canBeDownloaded = canBeDownloadedUpdate;
    }
    if(isNaN(minAgeRestrictionUpdate)){
        foundVideoUpdate.minAgeRestriction = minAgeRestrictionUpdate;
    }
    else if(minAgeRestrictionUpdate){
        if(minAgeRestrictionUpdate !== "number" || minAgeRestrictionUpdate < 1 || minAgeRestrictionUpdate > 18){
            res.status(400).send({
                "errorsMessages":
                    [{
                        message: "bad field",
                        field: "minAgeRestriction"
                    }]
            });
            return;
        }
        foundVideoUpdate.minAgeRestriction = minAgeRestrictionUpdate;
    }
    if(publicationDateUpdate){
        if(publicationDateUpdate !== "string"){
            res.status(400).send({
                "errorsMessages":
                    [{
                        message: "bad field",
                        field: "canBeDownloaded"
                    }]
            });
            return;
        }
        foundVideoUpdate.publicationDate = publicationDateUpdate;
    }
    if(availableResolutionsReqUpdate){
        let resolutionFlagUpdate = true;
        for(const resolutionReq of availableResolutionsReqUpdate)
            for(const resolutionRigth of resolutions)
                if(resolutionReq !== resolutionRigth)
                    resolutionFlagUpdate = false;
        if(resolutionFlagUpdate){
            foundVideoUpdate.availableResolutions = availableResolutionsReqUpdate;
        }
        else {
            res.status(400).send({
                "errorsMessages":
                    [{
                        message: "bad resolutions",
                        field: "availableResolutions"
                    }]
            });
            return;
        }
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
    res.sendStatus(204);
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})