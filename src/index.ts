import express, { type Request, type Response, type Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabase.js";
import { verificartoken, type AuthRequest } from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || "";

const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "8h") as any;

app.post('/api/register', async (req: Request, rest: Response): Promise<any> => {
    try {
        const { email, nombre, password } = req.body;


        if (!email || !password || !nombre) {
            return rest.status(400).json({ error: ' TODOS LOS CAMPOS SON REQUERIDOS' });
        }

        const { data: usuarioExistente } = await supabase.from('Usuarios').select('email').eq('email', email).maybeSingle();

        if (usuarioExistente) {
            return rest.status(400).json({ error: 'El correo ya existe' });
        }

        const saltrounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltrounds);

        const { data: nuevoUsuario, error: insertError } = await supabase.from('Usuarios').insert([{
            email: email,
            nombre: nombre,
            contraseña: hashedPassword,
            activo: true,
            eliminado: false,
            fecha_creacion: new Date().toISOString(),
        }])
            .select()
            .single();

        if (insertError) {
            return rest.status(500).json({ error: 'Error al registrar el usuario' });
        }

        return rest.status(201).json({ message: 'Usuario registrado correctamente', usuario: nuevoUsuario });


    } catch (error) {
        console.log(error);
        return rest.status(500).json({ error: 'Error al registrar el usuario' });
    }
})



app.post('/api/login', async (req: Request, rest: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return rest.status(400).json({ error: 'EMAIL Y CONTRASEÑA SON REQUERIDOS' });
        }

        const { data: usuario, error } = await supabase.from('Usuarios').select('*').eq('email', email).single();

        if (error || !usuario) {
            return rest.status(401).json({ error: 'Usuario no encontrado' });
        }

        //validacion de que si este activo el usuario y no este eliminado
        if (!usuario.activo || usuario.eliminado) {
            return rest.status(401).json({ error: 'Usuario inactivo o eliminado' });
        }

        const validpasswprd = await bcrypt.compare(password, usuario.contraseña)

        if (!validpasswprd) {
            return rest.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            {
                id_usuario: usuario.id_usuario,
                email: usuario.email,
                nombre: usuario.nombre
            },
            JWT_SECRET,
            {
                expiresIn: JWT_EXPIRES_IN
            }
        )

        return rest.status(200).json({
            message: 'Login exitoso',
            token: token,
            usuario: {
                id_usuario: usuario.id_usuario,
                email: usuario.email,
                nombre: usuario.nombre
            }
        });

    } catch (error) {
        console.log(error);
        return rest.status(500).json({ error: 'Error al iniciar sesión' });
    }
})

app.get('/api/perfil', verificartoken, async (req: AuthRequest, res: Response): Promise<any> => {
    try {

        const userId = req.usuario.id_usuario;


        const { data: usuario, error } = await supabase
            .from('Usuarios')
            .select('id_usuario, email, nombre, activo, fecha_creacion')
            .eq('id_usuario', userId)
            .single();

        if (error || !usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }


        return res.status(200).json({ perfil: usuario });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error al obtener el perfil' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});