const validate = require("../app/Http/middlewares/validate");
const authController = require("./controllers/authController");
const usuarioController = require("./controllers/usuarioController");

module.exports = (app) => {
    app.post("/usuario", usuarioController.create);

    app.group("/auth", (router) => {
        router.use([validate.user]);

        router.post("/login", authController.create);
        router.post("/refresh", [validate.accessToken], authController.update);
        router.post("/logout", authController.destroy);
    });
}
