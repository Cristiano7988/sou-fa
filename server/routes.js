const validate = require("../app/Http/middlewares/validate");
const authController = require("./controllers/authController");
const mercadoPagoController = require("./controllers/mercadoPagoController");
const usuarioController = require("./controllers/usuarioController");
const conteudoController = require("./controllers/conteudoController");

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/conteudos/')
    },
    filename: function (req, file, cb) {
        // Extração da extensão do arquivo original:
        const extensaoArquivo = file.originalname.split('.')[1];

        // Cria um código randômico que será o nome do arquivo
        const novoNomeArquivo = require('crypto')
            .randomBytes(64)
            .toString('hex');
        
        const filename = `${novoNomeArquivo}.${extensaoArquivo}`;

        req.body.midia = filename;

        // Indica o novo nome do arquivo:
        cb(null, filename);
    }
});
const upload = multer({ storage });

module.exports = (app) => {
    app.post("/usuario", usuarioController.create);

    app.group("/auth", (router) => {
        router.use([validate.userEmail]);

        router.post("/login", authController.create);
        router.post("/refresh", [validate.accessToken], authController.update);
        router.post("/logout", authController.destroy);
    });

    app.group("/users/:id/payments", (router) => {
        router.mergeParams = true;
        router.use([validate.userId]);

        router.post("/", mercadoPagoController.payments_create);
    });

    app.get("/conteudos", conteudoController.list);
    app.get("/conteudos/:id", conteudoController.get);

    app.group("/users/:id/conteudos", (router) => {
        router.mergeParams = true;
        router.use([validate.userId]);
        
        router.post("/", [upload.single('midia')], conteudoController.create);
    });

    // Meios de pagamento
    app.get("/payment_methods", mercadoPagoController.payment_methods);

    // Tipos de documento
    app.get("/identification_types", mercadoPagoController.identification_types);
}
