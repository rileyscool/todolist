const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

if (!fs.existsSync('./items.json')) {
    fs.writeFileSync('./items.json', JSON.stringify({}));
}

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/tasks', (req, res) => {
    const items = JSON.parse(fs.readFileSync('./items.json', 'utf8'));
    res.json(items);
});


app.post('/edit', (req, res) => {
    const body = req.body;
    const changeType = body.typeofChange; // "edit", "add", or "delete"
    const name = body.name; // Key name for the item
    const value = body.value; // Value to associate with the key

    // Read and parse the existing JSON data
    let items = JSON.parse(fs.readFileSync('./items.json', 'utf8'));

    if (changeType === 'edit') {
        // Update the value of an existing key
        if (items[name] !== undefined) {
            items[name] = value;
            fs.writeFileSync('./items.json', JSON.stringify(items, null, 2));
            res.status(200).send({ message: 'Item updated successfully!' });
        } else {
            res.status(404).send({ message: 'Item not found!' });
        }
    } else if (changeType === 'add') {
        // Add a new key-value pair
        if (items[name] === undefined) {
            items[name] = value;
            fs.writeFileSync('./items.json', JSON.stringify(items, null, 2));
            res.status(200).send({ message: 'Item added successfully!' });
        } else {
            res.status(400).send({ message: 'Item already exists!' });
        }
    } else if (changeType === 'delete') {
        // Delete a key-value pair
        if (items[name] !== undefined) {
            delete items[name];
            fs.writeFileSync('./items.json', JSON.stringify(items, null, 2));
            res.status(200).send({ message: 'Item deleted successfully!' });
        } else {
            res.status(404).send({ message: 'Item not found!' });
        }
    } else {
        res.status(400).send({ message: 'Invalid type of change!' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
