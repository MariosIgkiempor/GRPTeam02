const express = require("express");
const CSVFile = require("../models/CSV"); // bring in the CSVFile model
const router = express.Router();

// route to fetch all saved CSVFiles
router.get("/", (req, res) => {
  CSVFile.find().then(csvFiles => res.json(csvFiles));
});

// route to add a CSVFiles
router.post("/", (req, res) => {
  const newFile = new CSVFile({
    name: req.body.name,
    headings: req.body.headings,
    vals: req.body.vals,
    originalVals: req.body.originalVals,
    imputedVals: req.body.imputedVals,
    labels: req.body.labels,
    dataType: req.body.dataType,
    size: req.body.size,
    numFeatures: req.body.numFeatures,
    missingValues: req.body.missingValues,
    missingLabels: req.body.missingLabels,
    labelsRatio: req.body.labelsRatio,
    isCategorical: req.body.isCategorical,
    categories: req.body.categories,
    complexity: req.body.complexity,
    relations: req.body.relations,
    structure: req.body.structure,
    anomalies: req.body.anomalies
  });

  newFile.save().then(_ => res.json());
  // .then(json => console.log(json))
});

router.get("/names/", (req, res) => {
  CSVFile.find({}, (err, files) => {
    let names = { list: [] };
    files.forEach(file => names.list.push(file.name));
    res.json(names);
  });
});

router.get("/:name", (req, res) => {
  CSVFile.find({ name: req.params.name }, (err, file) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("found");
    res.json({ req.params });
  });
});

module.exports = router;
