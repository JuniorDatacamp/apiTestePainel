import * as yup from 'yup';

const addressSchema = yup.object().shape({    

    nome: yup
        .string()
        .nullable()
        .trim()
        .min(1, 'O nome não pode ficar vazio!')
        .required('O nome não pode ficar vazio.'),
    cpf: yup
        .string()
        .nullable(),
    cnpj: yup
        .string()
        .nullable(),  
    senha: yup
        .string()
        .trim()
        .min(4, 'Senha deve ter mínimo de 4 digitos.')
        .required('Entre com um valor em senha.'),
    nivel: yup
        .number()
        .required()
        .integer()
});

export default addressSchema;