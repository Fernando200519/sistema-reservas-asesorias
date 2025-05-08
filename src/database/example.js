const oracledb = require('oracledb');

async function runApp() {
    let connection;
    try {
        connection = await oracledb.getConnection({ 
            user: "equipocaa",
            password: "proyecTo_asesorias1",
            connectionString: "caa23_low" 
        });

        console.log("Connected to Oracle Database");
    
    } catch (err) {
        console.error(err);
        throw err;
    }
}