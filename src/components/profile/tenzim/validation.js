import * as yup from 'yup';

const changePasswordValidation = yup.object().shape({
    old_password: yup
        .string()
        .min(6, "Köhnə şifrə ən azı 6 simvol olmalıdır!")
        .required("Köhnə şifrə mütləq daxil edilməlidir!"),
    
    new_password: yup
        .string()
        .min(6, "Yeni şifrə ən azı 6 simvol olmalıdır!")
        .max(100, "Yeni şifrə maksimum 100 simvol ola bilər!")
        .notOneOf([yup.ref('old_password')], "Yeni şifrə köhnə şifrədən fərqli olmalıdır!")
        .required("Yeni şifrə mütləq daxil edilməlidir!"),
    
    confirm_password: yup
        .string()
        .oneOf([yup.ref('new_password'), null], "Şifrələr uyğun gəlmir!")
        .required("Şifrəni təsdiqləmək mütləqdir!")
});

export default changePasswordValidation;