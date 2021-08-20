//po main "type": "module",
const readline = require("readline");
const fs = require("fs/promises");


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function inputText(msg) {
    return new Promise((resolve) => {
        rl.question(msg, (answer) => {
            resolve(answer);
        });
    });
}
function inputNumber(msg) {
    return new Promise((resolve, reject) => {
        rl.question(msg, (answer) => {
            const num = parseFloat(answer);
            if (!isNaN(num) && Number.isFinite(num)) {
                resolve(num);
            } else {
                reject(new Error(`${answer} is not a number`));
            }
        });
    });
}

async function main() {
  
let vardas = await inputText("Ivesk varda: ");
console.log(vardas);
try {
    let alga = await inputNumber("Ivesk alga: ");
    console.log(alga);
    } catch (err) {
    console.log("blogas skaicius", err);
    }

    let zmones = [
        {
            vardas: "Jonas",
            pavarde: "Jonaitis",
            alga: 123.48
        },
        {
            vardas: "Petras",
            pavarde: "Petraitis",
            alga: 123.48
        },
        {
            vardas: "Antanas",
            pavarde: "Antanaitis",
            alga: 123.48
        }
    ];
    try {
        await fs.writeFile("zmones.json", JSON.stringify(zmones), {
            encoding: "utf-8"
        });
    } catch (err) {
        console.log("Failed to write to file", err);
    }

    rl.close();
}
main();
/*
<ul>
  <li> Atspausdinti visus zmones </li>
  <li> Prideti nauja zmogu </li>
  <li> Istrinti zmogu </li>
  <li> Pabaigti </li>
</ul>

<ul>
  <li> atspausdinti visus zmones </li>
  <li> prideti nauja zmogu</li>
  <li> istrinti zmogu </li>
  <li> pabaigti </li>
</ul>
*/


/*
let s1 = "";
let s2 = "";
try {
s1 += await fs.readFile("failas1.json");
s2 += await fs.readFile("failas2.json");
} catch (err) {
console.log("Klaida skaitant is failo:", err);
}
console.log(s1, s2);

try {
    let m1 = JSON.parse(s1);
    let m2 = JSON.parse(s2);
    console.log(m1, m2);
    let m = m1.concat(m2);
    console.log(m);
    m.sort((e1, e2) => e1.length - e2.length);
    console.log(m);
} catch (err) {
    console.log("Tai ne JSON'as");
}
   
console.log("pabaiga");
*/
/*
zmoniu sarasas

vienas zmogus atrodo taip:
{
    vardas: "Jonas"
    pavarde: "Jonaitis",
    alga: 123.48
}

parodom meniu:
1. atspausdinti visus zmones
2. prideti nauja
3. istrinti zmogu
0. pabaigti

duomenys saugomi faile zmones.json
jei failo nera - programa sukuria faila pirmo pridejimo metu

1. perskaitom is zmones.json ir parodom sarasa (su numeriais)
jei failo nera - nieko nespausdinam
2. papraso ivesti varda, pavarde, alga
prideda nauja zmogu i sarasa (prie failo, jei nera sukuria)
3. papraso ivesti numeri (is saraso) zmogaus, kuri reikia istrinti
istrina is saraso ir perraso faila
0. baigia darba

pasirinkus neegzistuojanti meniu punkta (jei ivede ne 0, 1, 2, 3, tai vel spausdinti meniu)

*)
4. turtuoliu sarsas
papraso ivesti skaiciu
atspausdina visus zmones, kuriu alga didesne uz ivesta skaiciu

*/


meniu();

async function meniu() {
    console.log(`MENIU:
    1. atspausdinti visus žmones
    2. pridėti naują
    3. ištrinti žmogų
    4. daugiausiai uždirbančių (programmerių) sąrašas
    0. pabaigti
    `);
    try {
        rinkis = await inputNumber("Rinkis iš meniu: ");
    } catch (err) {
        console.log('Įvesk skaičių iš meniu!');
        rinkis = '';
    }
    await main();
    rl.close();
}

async function main() {
    if (rinkis === 0) {
        console.log('Ate! Programa baigė darbą!');
        rl.close();
    } else if (rinkis === 1) {
        let zmoniuArr = [];
        try {
            zmoniuArr = JSON.parse(await fs.readFile('zmones.json'));
            zmoniuArr.length === 0 ? console.log('Sąrašas tuščias. Papildykite!') : undefined;
            for (let i of zmoniuArr) {
                console.log(i);
            }
        } catch (err) {
            console.log("Nepavyko nuskaityti failo \'zmones.json\'. Pradžioje įveskite!");
        }
        await meniu();
    } else if (rinkis === 2) {
        let zmoniuArr = [];
        try {
        zmoniuArr = JSON.parse(await fs.readFile('zmones.json'));
        } catch (err) {
            // ignored 
        }
        let vardas = await inputText("Įvesk varda: ");
        let pavarde = await inputText("Įvesk pavarde: ");
        let alga = await inputNumber("Įvesk algą: ");
        zmoniuArr.push({vardas: vardas, pavarde: pavarde, alga: alga});
        await writeJSON(zmoniuArr);
        await meniu();
    } else if (rinkis === 3) {
        try {
            let zmoniuArr = JSON.parse(await fs.readFile('zmones.json'));
            // laikome, kad vardai yra unikalūs (id), arba bus ištrinti keli vienu metu
            let sitaIstrinsim = await inputText("Įvesk varda žmogaus, kurį nori ištrinti: ");
            const istrintasArr = zmoniuArr.filter(el => el.vardas !== sitaIstrinsim);
            await writeJSON(istrintasArr);
            console.log("Įvestu vardu žmonių sąraše nebeliko!");
        } catch (err) {
            console.log('Nėra ką trinti. Pradžioje įveskite!');
        }
        await meniu();
    } else if (rinkis === 4) {
        try {
            const zmoniuArr = JSON.parse(await fs.readFile('zmones.json'));
            let alga = await inputNumber("Įvesk turtuolio algą: ");
            const turtuoliai = zmoniuArr.filter(el => el.alga >= alga);
            turtuoliai.length === 0 ? console.log('Turtuolių nerasta!') : undefined;
            for(let i of turtuoliai) {
                console.log(i);
            }
        } catch (err) {
            console.log("Nepavyko nuskaityti failo \'zmones.json\'. Pradžioje įveskite!");
        }
        await meniu();
    } else {
        await meniu();
    }

    rl.close();
}

async function writeJSON(zmones) {
    try {
        await fs.writeFile("zmones.json", JSON.stringify(zmones), {
            encoding: "utf-8"
        });
    } catch (err) {
        console.log("Failed to write to file", err);
    }
}
