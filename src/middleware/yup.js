/**
 * Middleware de validation utilisant Yup pour valider les données de requête.
 * 
 * @param {Object} schema - Schéma Yup à utiliser pour la validation
 * @param {string} source - Source des données à valider : 'body', 'params', 'query'
 */
const yupValidator = (schema, source) => async (req, res, next) => {
    try {
        // Validation d'une source spécifique
        if (['body', 'params', 'query'].includes(source)) {
            // Valide les données et supprime les propriétés inconnues
            req[source] = await schema.validate(req[source], { 
                abortEarly: false, // Valide tous les champs et retourne toutes les erreurs
                stripUnknown: true // Supprime les champs qui ne sont pas définis dans le schéma
            });
        } else {
            // Si aucune source spécifique n'est fournie, valide l'ensemble de la requête
            await schema.validate({
                body: req.body,
                params: req.params,
                query: req.query,
            }, { 
                abortEarly: false 
            });
        }

        return next();
    } catch (error) {
        // Retourne la première erreur détectée par Yup
        return res.status(400).json({ 
            error: true, 
            message: error.errors ? error.errors[0] : error.message 
        });
    }
};

/**
 * Validation pour un tableau d'objets dans req.body
 * Utile pour les endpoints où plusieurs items doivent être validés individuellement
 */
yupValidator.array = (schema) => async (req, res, next) => {
    try {
        // Valide chaque élément du tableau en parallèle
        await Promise.all(
            req.body.map((item, index) => 
                schema.validate(
                    { body: item },
                    { 
                        context: { index }, 
                        abortEarly: false, 
                        stripUnknown: true 
                    }
                )
            )
        );
        return next();
    } catch (error) {
        return res.status(400).json({ 
            error: true, 
            message: error.errors ? error.errors[0] : error.message 
        });
    }
};

module.exports = { yupValidator };
