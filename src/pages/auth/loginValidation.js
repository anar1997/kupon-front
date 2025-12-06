import * as yup from 'yup';

const loginValidations = yup.object().shape({
    email: yup
        .string()
        .email("Düzgün email daxil edin!")
        .required("Email mütləq daxil edilməlidir!"),
    password: yup
        .string()
        .min(6, "Şifrə ən azı 6 simvol olmalıdır!")
        .required("Şifrə mütləq daxil edilməlidir!")
});

export default loginValidations;