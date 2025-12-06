// {
//     "fullname": [
//         "This field may not be blank."
//     ],
//     "email": [
//         "This field may not be blank."
//     ],
//     "phone": [
//         "This field may not be blank."
//     ],
//     "title": [
//         "This field may not be blank."
//     ],
//     "description": [
//         "This field may not be blank."
//     ]
// }
import * as yup from 'yup';

const validations = yup.object().shape({
    fullname: yup.string().required("Ad və Soyad mütləq daxil edilməlidir!"),
    email: yup.string().email("Düzgün email daxil edin!").required("Email mütləq daxil edilməlidir!"),
    phone: yup.string().required("Telefon nömrəsi mütləq daxil edilməlidir!"),
    title: yup.string().required("Mövzu mütləq daxil edilməlidir!"),
    description: yup.string().required("Mesaj mütləq daxil edilməlidir!"),
    // image: yup.mixed().required("Şəkil mütləq daxil edilməlidir!"),
})

export default validations;