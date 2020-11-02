import React, { useEffect, useRef, useContext, useState } from "react";
import axios from 'axios';
import "./adminPage.css";
import Products from "../../component/products/Products";
import socketIOClient from "socket.io-client";
import Context from '../../component/Context.js';
import UploadImage from "../../component/uploadComponent/Uploadimage.js";
import { Link } from "react-router-dom";

import { Form, Input, InputNumber, Button, Upload, Select } from 'antd';


const { Option } = Select;


const formItemLayout = {
    wrapperCol: {
        span: 5,
    },
};

// const normFile = (e) => {

//     console.log('Upload event:', e);

//     if (Array.isArray(e)) {
//         console.log("a");
//         return e;
//     }
//     console.log("b");
//     console.log("name:", e.file.name);

//     return e && e.fileList;

// };


const validateMessages = {
    required: "'${name}' זהו שדה חובה!",
};

const AdminPage = (props) => {
    const { PREFIX,products, setProducts, newProduct, deletedProduct } = useContext(Context);

    const [productTitle, setProductTitle] = useState('');
    const fileInput = useRef();

    const [base64, setBase64] = useState('');
    const [newProductImage, setNewProductImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    async function previewFile () {
        const preview = document.querySelector('img');
        const file = document.querySelector( 'input[type=file]').files[0];
        const reader = new FileReader();
        reader.addEventListener("load", async function () {
            // convert image file to base64 string
            preview.src = reader.result;
            setBase64(reader.result);
          }, false);
      
         if (file) {
             reader.readAsDataURL(file);
             
        }
      }
    
    const uploadImage = () => {
        
        // const uploadedFile = fileInput.current;
        // console.log(`http://localhost:3000/images/` + uploadedFile.files[0].name);
        axios.post(`${PREFIX}/uploadNewProductImage`, { base64 },
            
        )
    
            .then((res) => {
            console.log("res:",res);
            const url = res.data;
            setImageUrl(url);
        });
        //     uploadedFile.files[0], {
        //     params: { filename: uploadedFile.files[0].name},
        // onUploadProgress: (progressEvent) => {
        //     const percentCompleted = Math.round(
        //         (progressEvent.loaded * 100) / progressEvent.total
        //     );
        
        //         console.log("percentCompleted:", percentCompleted);
                
        //         setNewProductImage(`/images/` + uploadedFile.files[0].name);
        //         // setNewProductImage(`http://localhost:5000${PREFIX}/images/` + uploadedFile.files[0].name);
        //     },
        // }
        
    
        // console.log(newProductImage.image);

    };



    
    const onFinish = (values) => {
        console.log("values:", values);
        // console.log(uploadedFile.files[0]);

        const newProduct = {
            title: values.product.title,
            // image: newProductImage,
            // image: base64,
            image: imageUrl,
            price: values.product.price,
            description: values.product.description,
            quantity: values.product.quantity,
            pdf_description: values.product.pdf_description,
        };

        axios
            // .post(`http://127.0.0.1:5000${PREFIX}/products`, newProduct)
            .post(`${PREFIX}/products`, newProduct)
            .then((res) => {
                // console.log("newProduct:", newProduct)
                // console.log(res);
            });
    }
    useEffect(() => {
        // axios.get(`http://localhost:5000${PREFIX}/products`)
        axios.get(`${PREFIX}/products`)
            .then((res) => {
                const productsarray = res.data;
                setProducts(productsarray);
            });
    }, [newProduct, deletedProduct]);
    const idTodelete = useRef();
    const idToUpdate = useRef();


    const [selectedProductToDelete, setSelectedProductToDelete] = useState('');

    function onChange(value, title) {
        setSelectedProductToDelete(value);
        setProductTitle(title.title)
    }
    function DeleteProduct() {
        axios
            // .delete(`http://127.0.0.1:5000${PREFIX}/products/${selectedProductToDelete}`)
            .delete(`${PREFIX}/products/${selectedProductToDelete}`)
            .then((res) => {
                alert(`המוצר ${productTitle}, שמספרו המזהה ${selectedProductToDelete} נמחק`);
            });
    }
    
    return (
        <div className="adminPage" dir="rtl">
            <Link to="/">
                <button className="Home_button">חזור לדף הבית</button>

            </Link>
            < div className="delete_product">
                <h1>מחיקת מוצר </h1>

                <Form
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="select"
                        label="Select"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'לא בחרת מוצר למחיקה',
                            },
                        ]}
                    >
                        <Select placeholder="בחר מוצר למחיקה"
                            onChange={onChange}
                        >
                            {products.map((product) => (
                                <Option key={product._id} value={product._id} title={product.title} >
                                    {product.title}
                                </Option>
                            ))}
                        </Select>

                    </Form.Item>
                    <button className="send id" onClick={DeleteProduct}>לחץ כדי למחוק</button>
                    <input className="deletedProductInput" type="text" size="big" ref={idTodelete} placeholder="  או הכנס את ה id של המוצר" />

                </Form>
                <div className="update_quantity">
                    <h1>עדכון מלאי מוצר </h1>
                    <input className="deletedProductInput" type="text" ref={idToUpdate} placeholder="של המוצר שברצונך לעדכן id הכנס את ה" />
                    <button className="send id" onClick={idToUpdate}>לחץ כדי לעדכן</button>
                </div>
                <div className="newProductInPut">

                    <h1>הוספת מוצר חדש</h1>
                    <Form
                        name="validate_other"
                        {...formItemLayout}
                        // onFinish={onFinish}
                        initialValues={{
                            ['input-number']: 0
                        }}
                        validateMessages={validateMessages}



                    >
                        <Form.Item
                            name={["product", "title"]}

                            rules={[
                                {
                                    required: true,
                                    message: 'עליך לציין את שם המוצר'
                                },
                            ]}
                        >
                            <Input placeholder="כתוב את שם המוצר " />
                        </Form.Item>


                        <Form.Item
                            name={["product", "price"]}
                            key="מחיר המוצר"
                            rules={[
                                {
                                    required: true,
                                    message: 'עליך לציין את מחיר המוצר'

                                },
                            ]}
                        >
                            <InputNumber placeholder="מחיר המוצר" />
                        </Form.Item>

                        <Form.Item
                            name={["product", "image"]}
                            key="תמונה"
                            rules={[
                                {
                                    required: true,
                                    message: 'עליך להוסיף את תמונת המוצר'

                                },
                            ]}>
                            <div>
                                בחר את תמונת המוצר
                            <input type="file" placeholder="תמונת המוצר" ref={fileInput} onChange={previewFile}  />
                                <img src="" width="10" height="10" alt="עדיין לא נתקבלה תמונה"/>
                                <button className="uploadImage" onClick={uploadImage}>אשר את התמונה שבחרת</button>
   
                            </div>
                        </Form.Item>


                        <Form.Item
                            name={["product", "quantity"]}
                            rules={[
                                {
                                    required: true,
                                    message: 'עליך להכניס את כמות המוצרים שבמלאי'

                                },
                            ]}
                        >
                            <InputNumber placeholder="כמות במלאי" />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                span: 6,
                                offset: 6,
                            }}
                        >
                            <Button type="primary" htmlType="submit" onClick={props.addProduct}>  שלח </Button>
                        </Form.Item>
                    </Form>
{/* <div>תמונתך נתקבלה, לחץ "שלח" להשלמת העלאת המוצר</div> */}

                </div>
            </div>
        </div >);

}

export default AdminPage;

