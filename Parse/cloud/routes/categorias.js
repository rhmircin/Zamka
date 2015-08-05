var Categoria = Parse.Object.extend("Categorias");

// Shows the list of memes
exports.fetch = function (req, res) {
    var query = new Parse.Query(Categoria);
    query.limit(100);
    query.descending('createdAt');
    query.find().then(function (categorias) {
        res.json(categorias);
    });
};