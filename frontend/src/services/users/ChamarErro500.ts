import axios from 'axios';

const chamarErro500 = async () => {
    try {
        const response = await axios.get('http://localhost/erro500.php');
        console.log('Resposta do servidor PHP:', response.data);
    } catch (error: any) {
        if (error) {
            // O servidor respondeu com um status diferente de 2xx
            console.error('Erro ao chamar a função PHP:', error.response.data);
            console.error('Status code:', error.response.status);
        } else {
            // Algum outro erro ocorreu durante a requisição
            console.error('Erro ao chamar a função PHP:', error.message);
        }
    }
};

export default chamarErro500;