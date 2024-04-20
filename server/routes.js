const validate = require("../app/Http/middlewares/validate");
const authController = require("./controllers/authController");
const mercadoPagoController = require("./controllers/mercadoPagoController");
const usuarioController = require("./controllers/usuarioController");
const conteudoController = require("./controllers/conteudoController");

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
    app.group("/users/:id/conteudos", (router) => {
        router.mergeParams = true;
        router.use([validate.userId]);

        router.post("/", conteudoController.create);
    });

    // Meios de pagamento
    app.get("/payment_methods", mercadoPagoController.payment_methods);

    // Tipos de documento
    app.get("/identification_types", mercadoPagoController.identification_types);
}
