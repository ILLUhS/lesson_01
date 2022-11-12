"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3003;
const jsonBody = express_1.default.json();
app.use(jsonBody);
const db = {
    cars: [{ id: 1, name: 'Vesta' },
        { id: 2, name: 'Granta' },
        { id: 3, name: 'Niva' },
        { id: 4, name: 'Kalina' }]
};
app.get('/', (req, res) => {
    res.send({ message: 'Hello World!' });
});
app.get('/cars', (req, res) => {
    res.json(db.cars);
});
app.get('/cars/:id', (req, res) => {
    const foundCars = db.cars.find(c => c.id === +req.params.id);
    if (!foundCars) {
        res.sendStatus(404);
        return;
    }
    res.json(foundCars);
});
app.post('/cars', (req, res) => {
    const car = {
        id: Number(new Date()),
        name: req.body.name
    };
    db.cars.push(car);
    res.status(201).json(car);
});
app.delete('/cars/:id', (req, res) => {
    for (let c = 0; c < db.cars.length; c++)
        if (db.cars[c].id === Number(req.params.id)) {
            db.cars.splice(c, 1);
            c = db.cars.length + c;
            res.sendStatus(204);
        }
    res.sendStatus(404);
});
app.put('/cars/:id', (req, res) => {
    if (!req.body.name) {
        res.sendStatus(400);
        return;
        ;
    }
    const foundCars = db.cars.find(c => c.id === +req.params.id);
    if (!foundCars) {
        res.sendStatus(404);
        return;
    }
    foundCars.name = req.body.name;
    res.sendStatus(204);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
