import readline from "readline";
import mysql from "mysql";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  function inputText(msg) {
    return new Promise((resolve) => {
      rl.question(msg, (text) => {
        resolve(text);
      });
    });
  }


const conn = mysql.createConnection({
    host: "localhost",
    user: "nodejs",
    password: "nodejs123456",
    database: "zmones",
    multipleStatements: true,
});

function dbConnect() {
    return new Promise((resolve, reject) => {
        conn.connect((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}
function dbDisconnect() {
    return new Promise((resolve, reject) => {
        conn.end((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

function dbQuery() {
    return new Promise((resolve, reject) => {
        conn.query(...arguments, (err, results, fields) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                results,
                fields,
            });
        });
    });
}

function printTable(r) {
            let text = "";
            for (const col of r.fields) {
                text += col.name + "\t";
            }
            console.log(text);
            for (const row of r.results) {
                text = "";
                for (const col of r.fields) {
                    text += row[col.name] + "\t";
                }
                console.log(text);
            }
        }
try {
        await dbConnect();
        let r = await dbQuery("select * from zmones");
        printTable(r);
        console.log("-----------------------------------------");
        r = await dbQuery("select * from kontaktai");
        printTable(r);
        console.log("-----------------------------------------");
        // r = await dbQuery(`select vardas, pavarde, tipas, reiksme
        // from zmones join kontaktai on zmones.id = kontaktai.zmones_id
        // order by vardas, pavarde`);
        // printTable(r);

// await dbQuery(
// "insert into zmones(vardas, pavarde) values ('vardenis', 'pavardenis')
//  );
//   let vardas = "Vardenis where id = -1; drop schema world; update zmones set vardas='padariau";
//   let alga = 789;
//   let id = 4;
//   await dbQuery(
//     `update zmones set vardas = ?, alga = ?, gim_data = ? where id = ?`,
//     [vardas, alga, new Date(), id]
//   );

let vardas = await inputText("Naujas vardas: ");
    let alga = parseFloat(await inputText("Kokia bus alga?: "));
    let id = parseInt(await inputText("Koks id: "));
    await dbQuery(
      `update zmones set vardas = ?, alga = ?, gim_data = ? where id = ?`,
      [vardas, alga, new Date(), id]
    );

r = await dbQuery(`select vardas, pavarde, tipas, reiksme
        from zmones join kontaktai on zmones.id = kontaktai.zmones_id
        order by vardas, pavarde`);
        printTable(r);

    } catch (err) {
        console.log("Klaida: ", err);
    } finally {
        try {
            await dbDisconnect();
        } catch (err) {
            // ignored
        }
    //    console.log("atsijungiau");
        rl.close();
    }



