import * as yup from 'yup';

const addressSchema = yup.object().shape({    

    nome: yup
        .string()
        .nullable()
        .trim()
        .min(1, 'O nome não pode ficar vazio!')
        .required('O nome não pode ficar vazio.'),
    email: yup
        .string()
        .nullable()
        .trim()
        .email('Digite um e-mail válido'),
    codvendedor: yup
        .number()
        .integer('O código do vendedor não pode ficar vazio.')
        .nullable()
        .required('O código do vendedor não pode ficar vazio.'),
    codempresa: yup
        .number()
        .integer('Código da empresa deve ser inteiro.')
        .nullable()
        .required('O código da empresa não pode ficar vazio.')
});

export default addressSchema;