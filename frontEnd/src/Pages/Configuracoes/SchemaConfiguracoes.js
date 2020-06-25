import * as yup from 'yup';

const addressSchema = yup.object().shape({
    
    con_email_servidorsmtp: yup
        .string()
        .nullable()
        .trim()
        .min(1, 'Servidor SMTP não pode ficar vazio!')
        .required('Servidor SMTP não pode ficar vazio.'),
    con_email_senha: yup
        .string()
        .nullable()
        .trim()
        .min(4, 'Senha deve ter mínimo de 4 digitos.')
        .required('Entre com um valor em senha.'),
    con_email_usuario: yup
        .string()
        .nullable()
        .trim()
        .min(1, 'E-mail não pode ficar vazio!')
        .required('Servidor SMTP não pode ficar vazio.')
        .email('Digite um e-mail válido'),
    con_email_porta: yup
        .number()
        .integer('A porta não pode ficar vazio.')
        .nullable()
        .required('A porta não pode ficar vazio.')
});

export default addressSchema;