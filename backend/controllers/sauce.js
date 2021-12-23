const Sauce = require('../models/Sauce');
const fs = require('fs');

// Obtention de toutes les sauces (READ)
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error}));
};

// Obtention d'une sauce en particulier (READ)
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error}));
};

// Création d'une sauce (CREATE)
exports.createSauce = (req, res, next) => {
    // Passage String => JS Object pour pouvoir créer la sauce
    const sauceObject = JSON.parse(req.body.sauce); 
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        // Récupérer tout les segments d'URL de l'image
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Votre sauce est enregistrée !'}))
    .catch(error => res.status(400).json({ error}));
};

// Modification d'une sauce (UPDATE)
exports.modifySauce = (req, res, next) => {
    if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({
            error: new Error('Requête non autorisée !')
        });
    }
    // Dans le cas de l'ajout d'une nouvelle image
    const sauceObject = req.file ? 
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; 
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message: 'Votre sauce a bien été modifiée !'}))
    .catch(error => res.status(400).json({ error}));
};

// Suppression d'une sauce (DELETE)
exports.deleteSauce = (req, res, next) => {
    // Chercher l'image afin de la supprimer aussi du dossier images
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        if (!sauce) {
            return res.status(404).json({
                error: new Error('Sauce non trouvé !')
            });
        }
        if (sauce.userId !== req.auth.userId) {
            return res.status(401).json({
                error: new Error('Requête non autorisée !')
            });
        }
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id})
            .then(() => res.status(200).json({ message: 'Votre sauce a bien été supprimée !'}))
            .catch(error => res.status(400).json({error}))
        });
    })
    .catch(error => res.status(500).json({ error}));
};

// Ajout de likes/dislikes pour une sauce (CREATE)
exports.likeOrDislikeSauce = (req, res, next) => {

};