const oracledb = require('oracledb');
oracledb.initOracleClient({ libDir: 'C:\\instantclient\\instantclient_19_26' });
const path = require('path');

const walletPath = path.join(__dirname, '..', '..', 'wallet');

async function connectToOracle() {
  try {
    process.env.TNS_ADMIN = walletPath; // ruta a tu wallet

    const connection = await oracledb.getConnection({
      user: "equipocaa",
      password: "proyecTo_asesorias1",
      connectionString: "147.154.27.228:1522/caa_tp" // lo sacas de tnsnames.ora
    });

    console.log("¡Conexión exitosa!");
    await connection.close();
  } catch (err) {
    console.error("Error al conectar:", err);
  }
}

connectToOracle();