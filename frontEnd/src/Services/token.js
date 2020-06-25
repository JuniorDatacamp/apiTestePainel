import funcUtils from '../utils/funcUtils';

const Token = {
    
    GetToken (){
    
        const isLogged = !!localStorage.getItem('iacces');  
        
        if (isLogged){
            const cryptoToken = localStorage.getItem('iacces');
            const token = funcUtils.descripto(cryptoToken);
            return token;
        }
    
        return '';
    },
    
    PostToken (token){
       
        const cryptToken = funcUtils.cripto(token);
        localStorage.setItem('iacces', cryptToken);
    }
    
};

export default Token;