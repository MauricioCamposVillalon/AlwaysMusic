const { Client } = require('pg');

const config = {
    user: 'postgres',
    host: '127.0.0.1',
    database: 'amusic',
    password: 'admin',
    port: 5432
}

const client = new Client(config);
client.connect();

const nuevo = (nombre, rut, curso, nivel) => {
    return new Promise((resolve, reject) => {
        client.query(`
        INSERT INTO alumno(nombre, rut, curso, nivel) 
        values('${nombre}', '${rut}', '${curso}', '${nivel}') RETURNING *;`, (err, res) => {
            if(err) reject(err);
            if(res) resolve(res);
            client.end();
        })
    })
}

const consulta = () => {
    return new Promise((resolve, reject) => {
        client.query(`SELECT * FROM alumno ;`, (err, res) => {
            if(err) reject(err);
            if(res) resolve(res);
            client.end();
        })
    })
}

const editar = (nombre, rut, curso, nivel) => {
    return new Promise((resolve, reject) => {
        client.query(`
        UPDATE alumno SET nombre ='${nombre}', curso='${curso}',nivel='${nivel}'
        WHERE id = ( SELECT id FROM alumno where  rut='${rut}') RETURNING *;`, (err, res) => {
            if(err) reject(err);
            if(res) resolve(res);
            client.end();
        })
    })
}

const buscar_rut = (rut) => {
    return new Promise((resolve, reject) => {
        client.query(`
        SELECT nombre, rut, curso, nivel FROM alumno WHERE rut='${rut}';`, (err, res) => {
            if(err) reject(err);
            if(res) resolve(res);
            client.end();
        })
    })
}


const eliminar = (rut) => {
    return new Promise((resolve, reject) => {
        client.query(`
        DELETE FROM alumno WHERE rut='${rut}' RETURNING *;`, (err, res) => {
            if(err) reject(err);
            if(res) resolve(res);
            client.end();
        })
    })
}

const argumentos = process.argv.slice(2);
let comando = argumentos[0].toLowerCase(); // DEJO EL COMANDO EN MINUSCULA CON toLOWERCASE
let nombre, rut, curso, nivel;



switch (comando) {
    case 'nuevo':
        nombre = argumentos[1];
        rut = argumentos[2];
        curso = argumentos[3];
        nivel = argumentos[4];
        nuevo(nombre, rut, curso, nivel)
        .then(res => console.log(`Estudiante ${nombre} agregado con exito.`, res.rows))
        .catch(error =>console.log(`Error al insertar usuario: ${nombre}`, error));
           
    break;
    case 'consulta':
        consulta()
        .then(res => console.log("Registro Actual :",res.rows))
        .catch(error =>console.log("Error al consultar por la base de datos", error));
    break;
    case 'editar':
        nombre = argumentos[1];
        rut = argumentos[2];
        curso = argumentos[3];
        nivel = argumentos[4];
        editar(nombre, rut, curso, nivel)
        .then(res => console.log(`El estudiante ${nombre} fue modificado con exito.`, res.rows))
        .catch(error =>console.log(`Error al insertar usuario: ${nombre}`, error));
    break;
    case 'rut':
        rut = argumentos[1];
        buscar_rut(rut)
        .then(res => console.table(res.rows))
        .catch(error =>console.log(`Error al buscar RUT: ${rut}`, error));
    break;
    case 'eliminar':
        rut = argumentos[1];
        eliminar(rut)
        .then(res => console.table(`Registro de estudiante con RUT ${rut} ha sido eliminado`,res.rows))
        .catch(error =>console.log(`Error al eliminar registro con RUT: ${rut}`, error));
    break;
    default:
        console.log("Se ha ingresado una opcion invalida")
    break;
}