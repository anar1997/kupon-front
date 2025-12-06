// yup elave et:
// referal kod null ola biler
// passwordu yoxlamaq
import * as yup from 'yup';

const validations = yup.object().shape({
    first_name: yup.string().required("Ad mütləq daxil edilməlidir!"),
    last_name: yup.string().required("Soyad mütləq daxil edilməlidir!"),
    email: yup.string().email("Düzgün email daxil edin!").required("Email mütləq daxil edilməlidir!"),
    phone: yup.string().required("Telefon nömrəsi mütləq daxil edilməlidir!"),
    region: yup.string().required("Region mütləq seçilməlidir!"),
    password: yup.string().min(6, "Şifrə ən azı 6 simvol olmalıdır!").required("Şifrə mütləq daxil edilməlidir!"),
    password_confirm: yup.string()
        .oneOf([yup.ref('password'), null], "Şifrələr uyğun gəlmir!")
        .required("Şifrəni təsdiqləmək mütləqdir!"),
    referred_by_code: yup
        .string()
        .nullable()
        .notRequired(),
})

export default validations;