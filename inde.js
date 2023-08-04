const { EventEmitter } = require('events')
const readline = require("readline")
const fs = require("fs")

const eventoResumo = new EventEmitter()

const leitor = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

leitor.question("Digite o nome do arquivo: ", function (nomeDoArquivo) {
    lerAquivo(nomeDoArquivo)
})

function lerAquivo(nomeDoArquivo) {
    fs.readFile(nomeDoArquivo, "utf8", (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        console.time("Quanto tempo demorou a execução: ")
        const arrayData = data.split("\r\n")
        let linhaComStrings = 0
        let somaNumeros = 0
        const contagemLinha = (itemArray) => {
            if (itemArray === '') {
                return
            } else if (isNaN(itemArray)) {
                linhaComStrings += 1
            } else {
                somaNumeros += Number(itemArray)
            }
        }
        arrayData.map((itemArray) => contagemLinha(itemArray))
        eventoResumo.emit("exibirResumo", somaNumeros, linhaComStrings)
        leitor.question("\nDeseja executar novamente: ", function (resposta) {
            if (resposta.toUpperCase() === "S" || resposta.toUpperCase() === "SIM") {
                leitor.question("Digite o nome do arquivo: ", function (nomeDoArquivo) {
                    lerAquivo(nomeDoArquivo)
                })
            } else
                
                leitor.close()
        })
    })
}

eventoResumo.on("exibirResumo", (somaNumeros, linhaComStrings) => {
    console.log("Soma dos números dentro deste arquivo: ", somaNumeros)
    console.log("Linhas continham texto: ", linhaComStrings)
    console.timeEnd("Quanto tempo demorou a execução: ")
})