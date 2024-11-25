import app from './app'

const port = 3001;

app.listen(port, () => {
    console.log(`Servidor está rodando na porta ${port}.`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Porta ${port} já está sendo usada.`);
        process.exit(1); // Finaliza o processo
    }
});
