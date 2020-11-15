import React, { useState,useContext,useEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import axios from "axios";
import Context from '../component/Context';





// const originData = [];

// for (let i = 0; i < 100; i++) {
//   originData.push({
  
//     key: i.toString(),
//     name: `Edrward ${i}`,
//     age: 32,
//     address: `London Park no. ${i}`,
//   });
// }

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {

  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = () => {
    const [form] = Form.useForm();
//   const [data, setData] = useState(originData);
    const { PREFIX, products, setProducts } = useContext(Context);
  
    useEffect(() => {
      axios.get(`${PREFIX}/products`)
         .then((res) => {
        const productsarray = res.data;
        setProducts(productsarray);
      });
      
  }, []);


   const [data, setData] = useState(products);
  const [editingKey, setEditingKey] = useState('');

//   const isEditing = (record) => record.key === editingKey;

//   const edit = (record) => {
//     form.setFieldsValue({
//       name: '',
//       age: '',
//       address: '',
//       ...record,
//     });
//     setEditingKey(record.key);
//   };
    
const isEditing = (record) => record._id === editingKey;
    
  const edit = (record) => {
    form.setFieldsValue({
        _id:'',
        title: '',
        price: '',
          quantity: '',
          image: '',
          description:'',
      ...record,
    });
    setEditingKey(record._id);
    
  };

  const cancel = () => {
    setEditingKey('');
  };

//   const save = async (key) => {
//     try {
//       const row = await form.validateFields();
//       const newData = [...data];
//       const index = newData.findIndex((item) => key === item.key);

//       if (index > -1) {
//         const item = newData[index];
//         newData.splice(index, 1, { ...item, ...row });
//         setData(newData);
//         setEditingKey('');
//       } else {
//         newData.push(row);
//         setData(newData);
//         setEditingKey('');
//       }
//     } catch (errInfo) {
//       console.log('Validate Failed:', errInfo);
//     }
//   };

    let newData = '';
    let index = '';
  const save =  async (_id) => {
    try {
        const row = await form.validateFields();
        newData = [...data];
      index = newData.findIndex((item) => _id === item._id);
        if (index > -1) {
        //   האיבר שצריך לעדכן
          const item = newData[index];
          console.log(item._id);
          newData.splice(index, 1, { ...item, ...row });
        //   המערך החדש עם האביר המעודכן
          setData(newData);

            setEditingKey('');
            upload();
        //   console.log("data:",data);
        //   console.log("item",item);
        //   console.log("newData[index]",newData[index]);
        //   setProducts(newData);
        //   console.log("newData:",newData);
        //   console.log(products);
      } else {
        newData.push(row);
        setData(newData);
          setEditingKey('');        
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    // {
    //   title: 'name',
    //   dataIndex: 'name',
    //   width: '25%',
    //   editable: true,
    // },
    // {
    //   title: 'age',
    //   dataIndex: 'age',
    //   width: '15%',
    //   editable: true,
    // },
    // {
    //   title: 'address',
    //   dataIndex: 'address',
    //   width: '40%',
    //   editable: true,
    // },
    {
      title: '_id',
      dataIndex: '_id',
      width: '1%',
      editable: true,
    },
    {
      title: 'title',
      dataIndex: 'title',
      width: '11%',
      editable: true,
    },
    {
      title: 'price',
      dataIndex: 'price',
      width: '11%',
      editable: true,
    },
    {
      title: 'quantity',
      dataIndex: 'quantity',
      width: '11%',
      editable: true,
    },
    {
      title: 'image',
      dataIndex: 'image',
      width: '11%',
      editable: true,
    },
    {
      title: 'description',
      dataIndex: 'description',
      width: '11%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            {/* <a
              href="javascript:;"
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a> */}
            <a
              href="javascript:;"
                    onClick={() =>  save(record._id) }
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <a disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </a>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
        onCell: (record) => ({
            record,
            // צריך להגדיר נכון גם את quantity וגם את image
            inputType: col.dataIndex ===  'price'  ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });


    const upload =
      () => {
          console.log('upload');
          console.log(newData[index]);
        axios.put(`${PREFIX}/updateProduct`, newData[index])
        }
    
  return (
      <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default EditableTable;