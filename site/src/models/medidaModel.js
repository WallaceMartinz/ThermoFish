var database = require("../database/config");

function buscarUltimasMedidas(idAquario, limite_linhas) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `select top ${limite_linhas}
                        Temperatura as temperatura, 
                        DT,
                        FORMAT(DT, 'HH:mm:ss') as momento_grafico
                    from Dados
                    where fkSensor_Dados = ${idAquario}
                    order by idDados desc`;
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `select 
        Temperatura as temperatura, 
                        DT,
                        DATE_FORMAT(DT,'%H:%i:%s') as momento_grafico
                    from Dados
                    where fkSensor_Dados = ${idAquario}
                    order by idDados desc limit ${limite_linhas}`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMedidasEmTempoReal(idAquario) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `select top 1
        Temperatura as temperatura,  
                        CONVERT(varchar, DT, 108) as momento_grafico, 
                        fkSensor_Dados
                        from Dados where fkSensor_Dados = ${idAquario} 
                    order by idDados desc`;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `select 
        Temperatura as temperatura, 
                        DATE_FORMAT(DT,'%H:%i:%s') as momento_grafico, 
                        fkSensor_Dados
                        from Dados where fkSensor_Dados =  ${idAquario} 
                    order by idDados desc limit 1`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal
}
