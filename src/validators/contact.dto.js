const yup = require('yup');

// Schema de validation pour le formulaire contact
const contactSchema = yup.object().shape({
  name: yup.string()
    .trim()
    .max(100, "Le nom est trop long")
    .required("Le nom est obligatoire"),
  
  email: yup.string()
    .trim()
    .email("Email invalide")
    .required("L'email est obligatoire"),
  
  message: yup.string()
    .trim()
    .max(5000, "Le message est trop long")
    .required("Le message est obligatoire"),
});

module.exports = {contactSchema};
