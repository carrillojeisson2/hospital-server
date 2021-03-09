const { response } = require('express');
const bcrpt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verifity');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No email'
            })
        }

        // Verificar password
        const validarPassword = bcrpt.compareSync(password, usuarioDB.password);
        if (!validarPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'No password'
            })
        }

        // Generar token
        const token = await generarJWT(usuarioDB.id);


        res.json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

const googleSignIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            // si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            // exite usuario
            usuario = usuarioDB;
            usuario.google = true
        }

        // guardar en DB
        await usuario.save();

        // Generar token
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            token

        });

    } catch (error) {

        res.status(404).json({
            ok: false,
            msg: 'Token no es correcto'
        })
    }


}

module.exports = {
    login,
    googleSignIn
}